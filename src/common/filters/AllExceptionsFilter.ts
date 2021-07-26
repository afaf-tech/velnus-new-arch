import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import errorStackParser, { StackFrame } from 'error-stack-parser';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BaseValidationError, ErrorBase } from '../exceptions';
import { Response } from '../http';

interface ResultErrorDev {
  type: string;
  message: string;
  stack: StackFrame[];
}

interface ResultError {
  message: string;
  validations?: Record<string, string[]>;
  detail?: string | string[];
  solution?: string | string[];
}

interface ResultData {
  status: HttpStatus;
  error: ResultError;
  debug?: ResultErrorDev;
}

function send(ctx: HttpArgumentsHost, data: ResultData) {
  const response = ctx.getResponse<Response>();
  response.status(data.status).json(data);
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  debug = process.env.NODE_ENV !== 'production';

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.logger.setContext('AllExceptionFilter');
  }

  static createErrorDev(exception: Error): ResultErrorDev {
    const type = exception.constructor.name;
    const stack = errorStackParser.parse(exception);
    return { type, message: exception.message, stack };
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.log('Catch');
    const ctx = host.switchToHttp();

    const result: ResultData = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        message: 'Something happened',
      },
    };

    // eslint-disable-next-line no-console
    console.log(exception);

    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse();
      result.status = exception.getStatus();
      result.debug = AllExceptionsFilter.createErrorDev(exception);

      if (exceptionResponse instanceof ErrorBase) {
        result.error.message = exceptionResponse.message;
        if ('solution' in exceptionResponse) {
          result.error.solution = exceptionResponse.solution;
        }
        if ('detail' in exceptionResponse) {
          result.error.detail = exceptionResponse.detail;
        }
        if ('devMessage' in exceptionResponse) {
          result.debug.message = exceptionResponse.devMessage;
        }

        if (this.debug && exceptionResponse.error instanceof Error) {
          result.debug = AllExceptionsFilter.createErrorDev(exceptionResponse.error);
        }
      } else if (exceptionResponse instanceof Error && this.debug) {
        const errorDev = AllExceptionsFilter.createErrorDev(exceptionResponse);
        result.debug.type = errorDev.type;
      } else if (exceptionResponse instanceof BaseValidationError) {
        result.error.validations = exceptionResponse.validations;
      }

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        result.error.message = exceptionResponse.message;
      }
    } else if (exception instanceof Error && this.debug) {
      result.debug = AllExceptionsFilter.createErrorDev(exception);
    }

    send(ctx, result);
  }
}
