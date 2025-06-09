import deviceServices from "../services/device-services.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await deviceServices.create(user, req.body);
        res.status(201).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await deviceServices.get(user);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const getDetail = async (req, res, next) => {
    try {
        const deviceId = req.params.deviceId;
        const result = await deviceServices.getDetail(deviceId);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const deviceId = req.params.deviceId;
        const result = await deviceServices.update(deviceId, req.body);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const deviceId = req.params.deviceId;
        const user = req.user;
        const result = await deviceServices.remove(user, deviceId);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const apiKeyPost = async (req, res, next) => {
    try {
        const deviceId = req.params.deviceId;
        const userId = req.user.id;
        const result = await deviceServices.apiKeyPost(userId, deviceId);
        res.status(201).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const apiKeyShow = async (req, res, next) => {
    try {
        const deviceId = req.params.deviceId;
        const userId = req.user.id;
        const keyId = req.params.keyId;
        const result = await deviceServices.apiKeyShow(userId, deviceId, keyId);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const apiKeyRemove = async (req, res, next) => {
    try {
        const deviceId = req.params.deviceId;
        const keyId = req.params.keyId;
        const userId = req.user.id;
        const result = await deviceServices.apiKeyRemove(userId, deviceId, keyId);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export default {
    create,
    get,
    getDetail,
    update,
    remove,
    apiKeyPost,
    apiKeyShow,
    apiKeyRemove
}