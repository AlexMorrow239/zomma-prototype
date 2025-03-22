import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Database
  MONGO_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  // Admin
  ADMIN_PASSWORD: Joi.string().required(),

  // Email
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASSWORD: Joi.string().required(),
  SMTP_FROM_ADDRESS: Joi.string().email().required(),

  // Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  NETWORK_MODE: Joi.boolean().default(false),

  // Development URLs
  FRONTEND_URL_LOCAL: Joi.string().uri().default('http://localhost:5173'),
  FRONTEND_URL_NETWORK: Joi.string().uri().default('http://localhost:5173'),

  // Prospect notification recipients
  PROSPECT_NOTIFICATION_RECIPIENTS: Joi.string().default(''),

  // Production URLs (only required in production)
  FRONTEND_URL: Joi.string().uri().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
