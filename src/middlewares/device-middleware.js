import { prisma } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { hashKey } from "../helper/utils.js";

    
const deviceMiddleware = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        res.status(401).json({
            error: "Unauthorized"
        }).end();
    } 

    const [type, token] = authHeader.split(' ');

    try {
        const hashed = hashKey(token);

        const device = await prisma.apiKey.findFirst({
            where: {
                key: hashed
            },
            select: {
            id: true,
            id_device: true,
            id_user: true,
            device: {
                select: {
                    id: true,
                    name: true,                }
                }
            }
        })
        
        if (!device) {
            throw new ResponseError(401, "Unauthorized: Invalid Token");
        } 
        else {
            
            req.device = device;
            next();
        }
}
    catch (error) {
        throw new ResponseError(401, "Unauthorized: Invalid Token"); 
    }

}

export {
    deviceMiddleware
}