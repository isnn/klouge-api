import { prisma } from "../application/database.js";
import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";

const authMiddleware = async (req, res, next) => {

    const token = req.get('Authorization');
    
    if (!token) {
        res.status(401).json({
            error: "Unauthorized"
        }).end();;
    } 

    const jwtAccesKey = process.env.JWT_ACCESS_KEY;

    try {
        const payload = jwt.verify(token, jwtAccesKey);
    
        const user = await prisma.user.findFirst({
            where: {
                id: payload.id
            },
            include: {
                role: true
            }
        })

        if (!user) {
            res.status(404).json({
                error: "User not found"
            }).end();
        } else {
            req.user = user;
            next();
        }
    } catch (error) {
        throw new ResponseError(401, "Unauthorized: Invalid Token"); 
    }
    
}

export {
    authMiddleware
}
