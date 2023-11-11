import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Provider } from '../users/users.service';
import { ProvidersService } from '../providers/providers.service';
import { Request } from 'express';
import { AuthGuard } from './guards/auth';
import { AuthProviderGuard } from './guards/provider';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly providersService: ProvidersService,
  ) {}

  @Get('/callback/:provider')
  // заранее проверяем, что имя провайдера валидно
  @UseGuards(AuthProviderGuard)
  async callBack(
    @Req() req: Request,
    @Query('code') code: string,
    @Param('provider') provider: Provider,
  ) {
    if (!code) throw new HttpException('No code provided', 400);

    // ОН НЕ МОЖЕТ СОХРАНИТЬ ПРОСТО АЙДИШНИК, ПОТОМУ ЧТО ЭТО НЕ СЕРИАЛИЗУЕТСЯ
    // ТАК ЧТО ЛУЧШЕ ЗАПИХИВАЙ ОБЪЕКТ ЦЕЛИКОМ ИЛИ ЗАПИХИВАЙ user = { id: '123' }
    req.session.user = await this.authService.extractProfileFromCode(
      provider,
      code,
    );

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(
            new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }
        resolve(true);
      });
    });

    return 'Теперь можно сделать запрос к / чтобы получить профиль юзера';
  }

  @Get(['/connect/:provider', '/login/:provider'])
  @Redirect()
  // заранее проверяем, что имя провайдера валидно
  @UseGuards(AuthProviderGuard)
  async connect(@Param('provider') provider: Provider) {
    const providerInstance = this.providersService.findService(provider);

    return {
      url: providerInstance.getAuthUrl(),
    };
  }

  // можно и post, я тут сделал так для простоты теста
  @Get('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(
            new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }
        resolve(true);
      });
    });
  }
}
