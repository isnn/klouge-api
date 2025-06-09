import { prisma } from "../application/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { validate } from "../validations/validation.js";
import { ResponseError } from "../error/response-error.js";
import { getDetailValidation, loginValidation, logoutValidation, updateValidation } from "../validations/user-validation.js";
import jwt from "jsonwebtoken";

const register = async (request) => {
    const username = request.body.username;
    const name = request.body.name;
    const role = request.body.role || 2;

    
    const countUser = await prisma.user.count({
        where: {
            username: username
        }
    });

    if (countUser > 0) {
        throw new ResponseError(401, "Username already exists");
    }
    
    const password = await bcrypt.hash(request.body.password, 10); 
    
    const user = {
        username: username,
        name: name,
        role: {
            connect: {
                id: parseInt(role)
            }
        },
        password: password
    }

    return prisma.user.create({
        data: user,
        select:{
            username: true,
            name: true,
            role: true,
        }
    });

}

const login = async (request, response) => {
    const loginRequest = validate(loginValidation, request);
    const user = await prisma.user.findUnique({
        where: {
            username: loginRequest.username,
        },
        include: {
            role: true
        }
    })  
    
    if (!user) {
        throw new ResponseError(401, "Invalid username or password");
    }
    
    const token = uuidv4().toString();
    
    const isPasswordValid  = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Invalid username or password");
    }

    const accessKey = process.env.JWT_ACCESS_KEY 
    const payload = {
        id: user.id,
        role: user.role.name,
    }
    const accessExpIn = {
        expiresIn: '1h' 
    }

    const jwtAccessToken = jwt.sign(payload, accessKey, accessExpIn);

    const payloadRefresh = {
        refresh : token
    }
    const refreshKey = process.env.JWT_REFRESH_KEY 
    const refreshExpIn = {
        expiresIn: 60 * 60 * 24 * 30 
    }
    const jwtRefreshToken = jwt.sign(payloadRefresh, refreshKey, refreshExpIn);

    const userLogin = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            token: token
        },
            include: {
            role: true
        }
    })

    response.cookie('refreshToken', jwtRefreshToken, {
        httpOnly: true,
        secure: false, 
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000  
    });

    const result = userLogin;
    result.token = jwtAccessToken

    const { password: _, ...safeUser } = result;

    return safeUser
}

const refresh = async (user, response, cookies) => {
    console.group('cokie', cookies)

    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
        throw new ResponseError(401, "Unauthorized: No refresh token provided");
    }

    const refreshKey = process.env.JWT_REFRESH_KEY;

    try {
        const token = jwt.verify(refreshToken, refreshKey);
        
        const isTokenValid = await prisma.user.findFirst({
            where: {
                token: token.refresh
            }
        });

        if (!isTokenValid) {
            throw new ResponseError(404, "Token not found");
        }

        // create new access token
        const accessKey = process.env.JWT_ACCESS_KEY 
        const payload = {
            id: user.id,
            role: user.role.name,
        }
        const accessExpIn = {
            expiresIn: '1h' 
        }
        const jwtAccessToken = jwt.sign(payload, accessKey, accessExpIn);

        // create new refresh token
        const newToken = uuidv4().toString();
        const payloadRefresh = {
            refresh : newToken
        }
        const refreshExpIn = {
            expiresIn: 60 * 60 * 24 * 30 
        }
        const jwtRefreshToken = jwt.sign(payloadRefresh, refreshKey, refreshExpIn);

        const result = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                token: newToken
            },
                include: {
                role: true
            }
        })

        response.cookie('refreshToken', jwtRefreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000  
        });

// kurang akses token
// hide password
        console.info("User refresh token:", jwt.decode(jwtRefreshToken, refreshKey ));
        result.token = jwtAccessToken
        
        const { password, ...safeUser } = result;

        return safeUser
   
    } catch (error) {
        console.log("Error verifying refresh token:", error);
        
        throw new ResponseError(401, "Unauthorized: Invalid refresh token");
    }
}

const getCurrentUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(userId),
        },
        include: {
            role: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "User not found");
    }

    const { password, token, ...safeUser } = user;

    return safeUser;
}

const getDetail = async (user, userIdRequest) => {

    if (user.role.name !== "admin" ){
        throw new ResponseError(403, "Forbidden: Only admin can access user details");
    }

    const result = await prisma.user.findUnique({
        where: {
            id: parseInt(userIdRequest),
        },
        include: {
            role: true
        }
    });

    if (!result) {
        throw new ResponseError(401, "User not found");
    }

    const { password, token, ...safeResult } = result;

    return safeResult;
}

const update = async (user, request) => {
    const updateRequest = validate(updateValidation, request);
    if (parseInt(updateRequest.id) !== user.id) {
        throw new ResponseError(403, "Forbidden");
    }

    const userOld = await prisma.user.findUnique({
        where: {
            id: parseInt(updateRequest.id),
        },
        include: {
            role: true
        }
    });
    
    if (!userOld) {
        throw new ResponseError(404, "User not found");
    }

    const data = {}
    const passwordNew = updateRequest.password ? await bcrypt.hash(updateRequest.password, 10) : null; 
    data.username = updateRequest.username || userOld.username;
    data.password = passwordNew || userOld.password;
    data.name = updateRequest.name || userOld.name;

    if (updateRequest.role) {
        if (userOld.role.name !== "admin" ){
            throw new ResponseError(403, "Forbidden: Only admin can change role");
        }

        data.role = {
            connect: {
                id: parseInt(updateRequest.role)
            }
        }
    }

    const userUpdate = await prisma.user.update({
        where: {
            id: userOld.id
        },
        data: data,
        select: {
            id: true,
            username: true,
            name: true,
            role: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return userUpdate;
}

const remove = async (user, userIdRequest) => {
    const updateRequest = validate(getDetailValidation, userIdRequest);
    if (user.role.name !== "admin") {
        throw new ResponseError(403, "Forbidden");
    }

    const userToDelete = await prisma.user.findUnique({
        where: {
            id: parseInt(updateRequest),
        }
    });

    if (!userToDelete) {
        throw new ResponseError(404, "User not found");
    }

    if (userToDelete.id === user.id){
        throw new ResponseError(403, "Forbidden");
    }

    const userDeleted = await prisma.user.delete({
        where: {
            id: parseInt(updateRequest),
        },
        select:{
            id: true,
            username: true
        }
    });

    return userDeleted;
}

const logout = async (request) => {
    const logoutRequest = validate(logoutValidation, request);

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(logoutRequest.id_user),
        }
    });

    if (!user) {
        throw new ResponseError(401, "User not found");
    }
    

    const userUpdate = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            token: null
        },
        select: {
            id: true,
            username: true,
        }
    });

    return userUpdate;
}

export default{
    register,
    login,
    refresh,
    update,
    getCurrentUser,
    getDetail,
    logout,
    remove
}