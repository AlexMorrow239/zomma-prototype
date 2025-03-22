import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Database
  MONGO_URL: Joi.string().default('mongodb://localhost:27017/zomma'),

  // JWT
  JWT_SECRET: Joi.string().default('development-jwt-secret'),

  // Admin
  ADMIN_PASSWORD: Joi.string().default('admin'),

  // Server
  PORT: Joi.number().default(3000),

  // Email (optional in development)
  SMTP_USER: Joi.string().email().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SMTP_PASSWORD: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SMTP_FROM_ADDRESS: Joi.string().email().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  NETWORK_MODE: Joi.boolean().default(false),

  // Frontend URL with defaults
  FRONTEND_URL: Joi.string().uri().optional(),

  // Prospect notification recipients
  PROSPECT_NOTIFICATION_RECIPIENTS: Joi.string().default(''),
});
