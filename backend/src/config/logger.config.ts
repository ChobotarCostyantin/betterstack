import type { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
    pinoHttp: {
        transport:
            process.env.NODE_ENV !== 'production'
                ? {
                      target: 'pino-pretty',
                      options: {
                          singleLine: true,
                          colorize: true,
                      },
                  }
                : undefined,
        // Stamp every HTTP log line with context:'HTTP'
        customProps: () => ({ context: 'HTTP' }),
        autoLogging: true,
        redact: ['req.headers.authorization'],
    },
};
