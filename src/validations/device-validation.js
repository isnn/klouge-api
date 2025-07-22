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

export const availablilityMetrics = Joi.object({
    cpu_usage: Joi.number().min(0).max(100).required(),
    memory_usage: Joi.number().min(0).max(100).required(),
    disk_space: Joi.number().min(0).max(100).required()
});
export const getMetricsValidation = Joi.array().items(
    Joi.object({
        timestamp: Joi.date().iso().max('now').messages({
        'date.max': `"timestamp" must not be in the future`,
        'date.format': `"timestamp" must be a valid ISO date`,
        }),
        metrics: availablilityMetrics.required(),
    })
).required();

