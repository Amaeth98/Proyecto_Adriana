import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const sslEnabled = (process.env.NEST_SSL ?? 'false').toLowerCase() === 'true';
  const sslKeyPath = process.env.SSL_KEY_PATH ?? '/etc/ssl/private/nest.key';
  const sslCertPath = process.env.SSL_CERT_PATH ?? '/etc/ssl/certs/nest.crt';

  const app = sslEnabled
    ? await NestFactory.create(AppModule, {
        httpsOptions: {
          key: readFileSync(sslKeyPath),
          cert: readFileSync(sslCertPath),
        },
      })
    : await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().set('json spaces', 2);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

bootstrap();
