import { registerAs } from '@nestjs/config';

// Simplified configuration - consolidating all configs into one export
export default () => ({
  environment: {
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  url: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  database: {
    uri: process.env.MONGO_URL || 'mongodb://localhost:27017/zomma',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  email: {
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromAddress: process.env.SMTP_FROM_ADDRESS,
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
  },
});
