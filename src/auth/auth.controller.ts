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
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly providersService: ProvidersService,
  ) {}

  @Get('/callback/:provider')
  @Redirect()
  async callBack(
    @Req() req: Request,
    @Query('code') code: string,
    @Param('provider') provider: Provider,
  ) {
    if (!code) throw new HttpException('No code provided', 400);

    req.session.user = await this.authService.extractProfileFromCode(
      provider,
      code,
    );

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(err);
        }
        resolve(
          'All done, now navigate to https://localost:3000 to display your profile',
        );
      });
    });

    return {
      url: '/',
    };
  }

  @Get(['/connect/:provider', '/login/:provider'])
  @Redirect()
  async connect(@Param('provider') provider: Provider) {
    const providerInstance = this.providersService.findService(provider);
    if (!providerInstance) {
      throw new HttpException('Unknown provider', HttpStatus.BAD_REQUEST);
    }

    return {
      url: providerInstance.getAuthUrl(),
    };
  }

  // можно и post, я тут сделал так для простоты
  @Get('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    req.session.destroy(() => {});
    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(err);
        }
        resolve('All done, now navigate to https://localost:3000');
      });
    });
  }
}
