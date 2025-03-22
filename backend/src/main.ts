import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

// Define the port directly in main.ts since it's only used here
const PORT = 3000;

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
    const host = '0.0.0.0';
    await app.listen(PORT, host);
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
    origin: '*',
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
    .setTitle('Zomma Portal API')
    .setDescription('Prospect intake portal for ZOMMA')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

// Handle unhandled bootstrap errors with logger
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
