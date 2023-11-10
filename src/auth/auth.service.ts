import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProvidersService } from '../providers/providers.service';
import { Provider, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly providersService: ProvidersService,
    private readonly usersService: UsersService,
  ) {}

  async extractProfileFromCode(provider: Provider, code: string) {
    const providerInstance = this.providersService.findService(provider);
    if (!providerInstance) {
      throw new HttpException(
        `No provider found "${provider}"`,
        HttpStatus.NOT_FOUND,
      );
    }

    const profile = await providerInstance.getUserByCode(code);

    let user = await this.usersService.findUserByProviderAccountId(
      profile.id,
      profile.provider,
    );

    if (!user) {
      user = await this.usersService.create(profile.provider, profile);
    }

    return user;
  }
}
