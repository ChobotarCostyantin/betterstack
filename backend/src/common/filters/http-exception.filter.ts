import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? (() => {
                      const res = exception.getResponse();
                      if (typeof res === 'string') return res;
                      if (
                          typeof res === 'object' &&
                          res !== null &&
                          'message' in res
                      ) {
                          const msg = (res as Record<string, unknown>).message;
                          return Array.isArray(msg)
                              ? msg.join(', ')
                              : String(msg);
                      }
                      return exception.message;
                  })()
                : 'Internal server error';

        if (status >= 500) {
            this.logger.error(
                { err: exception },
                `Unhandled exception: ${message}`,
                HttpExceptionFilter.name,
            );
        } else {
            this.logger.warn(
                `HTTP ${status} – ${message}`,
                HttpExceptionFilter.name,
            );
        }

        const code = statusToCode(status);
        response.status(status).json({ error: { code, message } });
    }
}

function statusToCode(status: number): string {
    const map: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        422: 'UNPROCESSABLE_ENTITY',
        429: 'TOO_MANY_REQUESTS',
        500: 'INTERNAL_SERVER_ERROR',
    };
    return map[status] ?? `HTTP_${status}`;
}
