import userServices from "../services/user-services.js";

const register = async (req, res, next) => {
    try {
        const result = await userServices.register(req);
        res.status(201).json({
            data: result
        });

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await userServices.login(req.body, res);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const refresh = async (req, res, next) => {
    try {
        const user = req.user;
        const cookies = req.cookies;
        
        const result = await userServices.refresh(user, res, cookies );
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const getCurrentUser = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await userServices.getCurrentUser(user.id);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const getDetail = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await userServices.getDetail(user, req.params.userId);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await userServices.update(user, req.body);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await userServices.remove(user, req.params.userId);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const result = await userServices.logout(req.body);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export default {
    register,
    login,
    refresh,
    logout,
    update,
    remove,
    getCurrentUser,
    getDetail
};