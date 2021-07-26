import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import config from '@config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: config,
      isGlobal: true,
    }),
  ],
})
class SetupModule {}

async function boostrap(): Promise<TypeOrmModuleOptions> {
  const app = await NestFactory.createApplicationContext(SetupModule, { logger: false });
  const configService = app.get(ConfigService);
  return configService.get<TypeOrmModuleOptions>('db');
}

export = boostrap();
