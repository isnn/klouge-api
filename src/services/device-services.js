import { prisma } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { generateKey, hashKey } from "../helper/utils.js";
import { createDeviceValidation, getDetailDeviceValidation, getDetailKeyValidation, getMetricsValidation, updateDeviceValidation } from "../validations/device-validation.js";
import { validate } from "../validations/validation.js";

const create = async (user, request) =>{
    const createRequest = validate(createDeviceValidation, request);
    const userId = user.id;
    
    const duplicateDeviceName = await prisma.device.findFirst({
        where: {
            id_user: userId,
            name: createRequest.name
        }
    })

    if (duplicateDeviceName) {
        throw new ResponseError(400, "Device name already exists");
    }

    const data = {
        id_user: userId,
        name: createRequest.name
    };

    const device = await prisma.device.create({
        data: data
    });

    return device;
}

const get = async (user) =>{
    const userId = user.id;

    const devices = await prisma.device.findMany({
        where: {
            id_user: userId
        },
        select: {
            id: true,
            name: true,
            create_at: true,
            update_at: true
        }
    });

    if (!devices){
        throw new ResponseError(404, "No devices found");
    }

    return devices;
}

const update = async (deviceId, request) => {
    const updateRequest = validate(updateDeviceValidation, request);

    const device = await prisma.device.findFirst({
        where: {
            id: parseInt(deviceId)
        }
    })

    if (!device) {
        throw new ResponseError(404, "Device not found");
    }

    const data = {
        name: updateRequest.name
    };

    const updatedDevice = await prisma.device.update({
        where: {
            id: parseInt(deviceId)
        },
        data: data,
        select: {
            id: true,
            name: true,
            create_at: true,
            update_at: true
        }
    });

    return updatedDevice;
}

const getDetail = async (deviceId) => {
    deviceId = validate(getDetailDeviceValidation, deviceId);
    const device = await prisma.device.findFirst({
        where: {
            id: parseInt(deviceId)
        },
        select: {
            id: true,
            name: true,
            create_at: true,
            update_at: true
        }
    });

    if (!device) {
        throw new ResponseError(404, "Device not found");
    }

    return device;
}

const remove = async (user, deviceId) => {
    deviceId = validate(getDetailDeviceValidation, deviceId);

    const device = await prisma.device.findFirst({
        where: {
            id: parseInt(deviceId),
            id_user: user.id
        }
    });

    if (!device) {
        throw new ResponseError(404, "Device not found");
    }

    const deletedDevice = await prisma.device.delete({
        where: {
            id: parseInt(deviceId)
        },
        select: {
            id: true,
            name: true
        }
    });

    return deletedDevice;
}

const apiKeyPost = async (userId, deviceId) => {
    deviceId = validate(getDetailDeviceValidation, deviceId);
    const device = await prisma.device.findFirst({
        where: {
            id: deviceId,
            id_user: userId
        }
    });

    if (!device) {
        throw new ResponseError(404, "Device not found or Access Denied");
    }

    const deviceApiKey = generateKey();
    const hashedApiKey = hashKey(deviceApiKey);
    
    const data = {
        id_user: device.id_user,
        id_device: device.id,
        key: hashedApiKey
    }

    const createdApiKey = await prisma.apiKey.upsert({
        where: {
            id_device: device.id
        },
        create: data,
        update: data
    });
    
    return {
        ...createdApiKey,
        key: deviceApiKey
    };
}

const apiKeyShow = async (userId, deviceId, keyId) => {
    deviceId = validate(getDetailDeviceValidation, deviceId);
    keyId = validate(getDetailKeyValidation, keyId);

    const device = await prisma.device.findFirst({
        where: {
            id: deviceId,
            id_user: userId
        }
    });

    if (!device) {
        throw new ResponseError(404, "Device not found or Access Denied");
    }

    const apiKey = await prisma.apiKey.findFirst({
        where: {
            id: parseInt(keyId),
            id_device: parseInt(deviceId),
        }
    })

    if (!apiKey) {
        throw new ResponseError(404, "Not found");
    }

    const data = {
        id_key : apiKey.id,
        api_key : true
    }

    return data;
}

const apiKeyRemove = async (userId, deviceId, keyId) => {
    keyId = validate(getDetailKeyValidation, keyId);

    const apiKey = await prisma.apiKey.findFirst({
        where: {
            id: keyId,
            id_device: parseInt(deviceId),
            id_user: userId
        }
    });

    if (!apiKey) {
        throw new ResponseError(404, "Forbidden");
    }

    const result = await prisma.apiKey.delete({
        where: {
            id: keyId
        }
    });

    return result;
}

const createMetrics = async (deviceId, request) => {
    request = validate(getMetricsValidation, request, { abortEarly: false });
    const data = request.map((item) => ({
        id_device: parseInt(deviceId),
        timestamp: new Date(item.timestamp),
        metrics: {
            cpu_usage: item.metrics.cpu_usage,
            memory_usage: item.metrics.memory_usage,
            disk_space: item.metrics.disk_space
        }
    }))
    const result = await prisma.deviceMetric.createMany({
        data: data,
        skipDuplicates: true
    });

    return result
}

export default {
    create,
    get,
    getDetail,
    update,
    remove,
    apiKeyPost,
    apiKeyShow,
    apiKeyRemove,
    createMetrics
};