import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();

  app.use(cookieParser());
  app.use(
    session({
      secret: 'replaceWithSomeSecretValue',
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: true,
        httpOnly: true,
        // это время жизни сессии в куки в миллисекундах, можно установить в 1 неделю
        maxAge: 60000,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
