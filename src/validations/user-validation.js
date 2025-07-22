import Joi from "joi";

export const userValidation = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
    role: Joi.number().valid(1, 2)
});

export const registerValidation = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
    role: Joi.number().optional()
});

export const loginValidation = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required()
})

export const logoutValidation = Joi.object({
    id_user: Joi.string().required(),
})

export const getDetailValidation = Joi.number().required();

export const updateValidation = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().optional(),
    password: Joi.string().optional(),
    name: Joi.string().optional(),
    role: Joi.number().optional(),
})