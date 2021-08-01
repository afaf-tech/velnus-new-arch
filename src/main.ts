import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ConfigApp } from '@config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionsFilter } from '@common/filters';
import { BadRequestException, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded } from 'body-parser';
import { BaseValidationError } from '@common/exceptions';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);

  const config = new DocumentBuilder();
  config.setTitle('Velnus App');
  config.setDescription('Velnus API');
  config.setVersion('0.1');
  config.addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'access-token',
  );

  const document = SwaggerModule.createDocument(app, config.build());
  const whitelist = ['http://localhost:9000', 'http://localhost:3000', 'http://localhost:5000'];

  SwaggerModule.setup('docs', app, document, {
    // swaggerOptions: {
    //   tagsSorter: 'alpha',
    //   operationsSorter: 'alpha',
    // },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      //   exposeDefaultValues: true,
      // },
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(new BaseValidationError(errors));
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useLogger(logger);

  app.use(urlencoded({ limit: '50mb', extended: false }));
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (whitelist.indexOf(origin) !== -1) {
        logger.debug(`allowed cors, ${origin}`);
        callback(null, true);
      } else {
        logger.debug(`blocked cors for: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization, Access-Control-Allow-Origin',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });

  const port = configService.get<ConfigApp['port']>('app.port');
  const host = configService.get<ConfigApp['url']>('app.url');

  await app.listen(port, host);
}

bootstrap();
