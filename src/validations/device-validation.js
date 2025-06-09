import Joi from "joi";

export const createDeviceValidation = Joi.object({
    id_user: Joi.string(),
    name: Joi.string().required(),
});

export const updateDeviceValidation = Joi.object({
    name: Joi.string().required(),
});

export const getDetailDeviceValidation = Joi.number().required();
export const getDetailKeyValidation = Joi.number().required();