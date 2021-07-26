import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ConfigApp, ConfigLogging } from '@config';
import type { WinstonModuleOptionsFactory, WinstonModuleOptions } from 'nest-winston';
import { utilities } from 'nest-winston';
import winston from 'winston';

@Injectable()
export class WinstonModuleFactory implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  // eslint-disable-next-line class-methods-use-this
  createWinstonModuleOptions(): WinstonModuleOptions {
    const configApp = this.configService.get<ConfigApp>('app');
    const config = this.configService.get<ConfigLogging>('logging');
    const transports = [];

    const consoleFormat = winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike(configApp.name),
    );

    transports.push(
      new winston.transports.File({
        filename: `${config.path}/logs`,
        level: 'error',
      }),
    );

    if (configApp.debug) {
      transports.push(
        new winston.transports.Console({
          format: consoleFormat,
        }),
      );
    }

    return { transports };
  }
}
