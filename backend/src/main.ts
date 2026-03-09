import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const logger = app.get(Logger);
    app.useLogger(logger);

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter(logger));
    app.useGlobalInterceptors(new TransformInterceptor());

    const config = new DocumentBuilder()
        .setTitle('Betterstack API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    app.setGlobalPrefix('api/v1');

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(
        `Application is running on: http://localhost:${port}`,
        'Bootstrap',
    );
    logger.log(
        `Swagger UI is running on: http://localhost:${port}/api/docs`,
        'Bootstrap',
    );
}

void bootstrap().catch((err) => {
    console.error('Fatal error during bootstrap', err);
    process.exit(1);
});
