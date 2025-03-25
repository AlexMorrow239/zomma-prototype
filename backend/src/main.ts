import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  // Create logger instance
  const logger = new Logger('Bootstrap');

  // Initialize app with custom logger
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get('server.port') || 3000;
  const nodeEnv = configService.get('environment.nodeEnv');

  try {
    // Configure API prefix and validation
    app.setGlobalPrefix('api', {
      exclude: ['/'], // Exclude root path from global prefix for health checks
    });

    // Add health check endpoint
    app.getHttpAdapter().get('/', (req, res) => {
      res.status(200).send({ status: 'ok' });
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        transformOptions: { enableImplicitConversion: true },
      })
    );

    // Configure CORS - simplified for deployment
    app.enableCors({
      origin:
        nodeEnv === 'production'
          ? configService.get('url.frontend')
          : configService.get('url.frontend') || 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Setup Swagger documentation if not in production
    if (nodeEnv !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('Zomma Portal API')
        .setDescription('Prospect intake portal for ZOMMA')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);
    }

    // Start the server
    const host = '0.0.0.0';
    await app.listen(port, host);
    logger.log(`Application running on port ${port} in ${nodeEnv} mode`);
  } catch (error) {
    logger.error('Failed to start application', error.stack);
    process.exit(1);
  }
}

// Handle unhandled bootstrap errors with logger
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
