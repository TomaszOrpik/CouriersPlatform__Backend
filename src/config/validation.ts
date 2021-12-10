import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3005),
  mongoUrl: Joi.string(),
  jwtSecret: Joi.string(),
  osrmEndpoint: Joi.string()
});
