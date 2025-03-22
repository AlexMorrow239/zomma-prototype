import { registerAs } from '@nestjs/config';

export const environmentConfig = registerAs('environment', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  isNetworkMode: process.env.NETWORK_MODE === 'true',
}));

export const urlConfig = registerAs('url', () => {
  const isNetworkMode = process.env.NETWORK_MODE === 'true';
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    frontend:
      nodeEnv === 'production'
        ? process.env.FRONTEND_URL
        : isNetworkMode
          ? process.env.FRONTEND_URL_NETWORK
          : process.env.FRONTEND_URL_LOCAL,
  };
});

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGO_URL,
  options: {
    family: 4, // Force IPv4
    directConnection: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
}));

export const serverConfig = registerAs('server', () => ({
  nodeEnv: process.env.NODE_ENV,
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
}));

export const emailConfig = registerAs('email', () => ({
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  fromAddress: process.env.SMTP_FROM_ADDRESS,
}));

export const prospectConfig = registerAs('prospect', () => ({
  notificationRecipients: process.env.PROSPECT_NOTIFICATION_RECIPIENTS
    ? process.env.PROSPECT_NOTIFICATION_RECIPIENTS.split(',').map((email) =>
        email.trim()
      )
    : [],
}));
