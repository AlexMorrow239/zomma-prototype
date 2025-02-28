import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as express from 'express';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';

async function bootstrap() {
  // Create logger instance
  const logger = new Logger('Bootstrap');

  // Initialize app with custom logger
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get config service
  const configService = app.get(ConfigService);

  try {
    // Configure global middleware
    configureGlobalMiddleware(app, logger);

    // Configure CORS
    configureCors(app, configService, logger);

    // Configure and setup Swagger documentation
    setupSwagger(app, logger);

    // Start the server
    const port = configService.get('server.port');
    const host = '0.0.0.0';
    await app.listen(port, host);

    // Log server information
    await logServerInformation(app, port, logger);
  } catch (error) {
    logger.error('Failed to start application', error.stack);
    process.exit(1);
  }
}

function configureGlobalMiddleware(app: any, logger: Logger) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
        exposeUnsetFields: false,
      },
      validateCustomDecorators: true,
      skipMissingProperties: true,
      stopAtFirstError: false,
    })
  );
}

function configureCors(app: any, configService: ConfigService, logger: Logger) {
  const frontendUrl = configService.get('url.frontend');
  logger.log(`Configuring CORS with frontend URL: ${frontendUrl}`);

  app.enableCors({
    origin: [
      frontendUrl,
      /^http:\/\/192\.168\.1\.\d{1,3}:\d+$/,
      'http://100.65.62.87:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
}

function setupSwagger(app: any, logger: Logger) {
  const config = new DocumentBuilder()
    .setTitle('Research Engine API')
    .setDescription('University of Miami Research Engine API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function logServerInformation(app: any, port: number, logger: Logger) {
  const serverUrl = await app.getUrl();
  const isNetworkMode = process.env.NETWORK_MODE === 'true';
  const networkUrl = `http://${require('os').networkInterfaces()['en0']?.[1]?.address || 'localhost'}:${port}`;

  logger.log({
    message: 'Server is running at:',
    endpoints: {
      ...(isNetworkMode
        ? {
            network: networkUrl,
            swagger: `${networkUrl}/api`,
          }
        : {
            local: `http://localhost:${port}`,
            ipv6: serverUrl,
            ipv4: `http://127.0.0.1:${port}`,
            swagger: `http://localhost:${port}/api`,
          }),
    },
  });
}

// Handle unhandled bootstrap errors with logger
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
