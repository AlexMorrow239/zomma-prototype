/**
 * Root module of the Research Engine API
 * Configures global settings, database connections, file uploads,
 * and imports all feature modules.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

// Feature modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
// Import configurations and validation schema
import { configValidationSchema } from './config/config.schema';
import * as config from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { ProspectModule } from './modules/prospect/prospect.module';
import { UsersModule } from './modules/user/user.module';

@Module({
  imports: [
    // Config Module with validation and typed configurations
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        config.databaseConfig,
        config.serverConfig,
        config.jwtConfig,
        config.environmentConfig,
        config.urlConfig,
        config.emailConfig,
      ],
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // Database configuration
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ProspectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorHandlingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
