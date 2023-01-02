import { Joi, Segments } from "celebrate"

export const register = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().optional().email(),
        password: Joi.string().required(),
        username: Joi.string().required(),
    }),
}

export const login = {
    [Segments.BODY]: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
}
