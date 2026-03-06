import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(Number(process.env.PORT ?? 3001), '0.0.0.0');
}
bootstrap();
