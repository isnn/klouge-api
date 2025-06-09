import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (err, req, res, next) => {

    if (!err){
        return next();
    }

    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            error:  err.message
        }).end();;
    } else {
        return res.status(500).json({
             error: err.message
        }).end();;
    }
}

export {
    errorMiddleware
}