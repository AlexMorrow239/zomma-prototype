import { registerAs } from '@nestjs/config';

// Simplified configuration - consolidating all configs into one export
export default () => ({
  environment: {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  url: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  database: {
    uri: process.env.MONGO_URL || 'mongodb://localhost:27017/zomma',
    options: {
      // Add common MongoDB connection options for reliability
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 50,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  email: {
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromAddress: process.env.SMTP_FROM_ADDRESS,
    // Default to a no-op email provider in development to prevent errors
    enabled: !!process.env.SMTP_USER || process.env.NODE_ENV === 'production',
  },
  prospect: {
    notificationRecipients: process.env.PROSPECT_NOTIFICATION_RECIPIENTS
      ? process.env.PROSPECT_NOTIFICATION_RECIPIENTS.split(',').map((email) =>
          email.trim()
        )
      : [],
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '0.0.0.0',
  },
});
