import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

    // Add request logging middleware
    configureRequestLogging(app, logger);

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
  logger.debug('Configuring global middleware');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  app.useGlobalInterceptors(new ErrorHandlingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
}

function configureRequestLogging(app: any, logger: Logger) {
  logger.debug('Configuring request logging middleware');

  app.use((req: any, res: any, next: () => void) => {
    // Log request
    const requestLog = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
    };
    logger.debug('Incoming request', requestLog);

    // Capture response data
    const oldEnd = res.end;
    const chunks: Buffer[] = [];

    // Override write to capture response body chunks
    const oldWrite = res.write;
    res.write = function (chunk: Buffer, ...args: any[]) {
      chunks.push(Buffer.from(chunk));
      return oldWrite.apply(res, [chunk, ...args]);
    };

    res.end = function (chunk: Buffer, ...args: any[]) {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }

      const responseBody = Buffer.concat(chunks).toString('utf8');
      let parsedBody;
      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        parsedBody = responseBody;
      }

      logger.debug('Outgoing response', {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: parsedBody,
      });

      return oldEnd.apply(res, [chunk, ...args]);
    };
    next();
  });
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
  logger.debug('Setting up Swagger documentation');

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
