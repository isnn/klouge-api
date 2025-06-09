import { ResponseError } from "../error/response-error.js";

const hasRole = (allowedRole = []) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role?.name) {
        throw new ResponseError(401, "Unauthorized");
        }

        const userRoles = req.user.role.name;
        if (!allowedRole.includes(userRoles)) {
            throw new ResponseError(403, "Forbidden");
        }

         next();
    }
}

export {
    hasRole
}