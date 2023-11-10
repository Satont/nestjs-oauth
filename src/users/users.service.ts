import { Injectable } from '@nestjs/common';
import { BaseUserInfo } from '../providers/services/base';

// это в призме ты тоже можешь сделать енамом
export const enum Provider {
  GITHUB = 'github',
  GOOGLE = 'google',
  VK = 'vk',
  YANDEX = 'yandex',
}

export type Account = {
  userId: number;
  provider: Provider;
  providerAccountId: string;
  access_token: string;
  refresh_token: string;
};

export type User = {
  userId: number;
  name: string;
  email: string | null;
  avatarUrl: string;
};

@Injectable()
export class UsersService {
  private mockedUsers = [
    {
      userId: 1,
      name: 'Satont',
      email: null,
      avatarUrl: 'https://avatars.githubusercontent.com/u/42675886?v=4',
    },
  ];
  private mockedUsersProvidersAccounts: Account[] = [
    {
      userId: 1,
      provider: Provider.GITHUB,
      providerAccountId: '42675886',
      // просто скрыл токены, чтобы на стриме не видно, в прод базе они будут
      access_token: '',
      refresh_token: '',
    },
  ];

  async findByEmail(email: string) {
    return this.mockedUsers.find((u) => u.email === email);
  }

  async findById(id: number) {
    return this.mockedUsers.find((u) => u.userId === +id);
  }

  async findUserByProviderAccountId(
    providerId: string,
    provider: Provider | string,
  ) {
    const profile = this.mockedUsersProvidersAccounts.find(
      (u) => u.provider === provider && u.providerAccountId === providerId,
    );

    if (!profile) {
      return null;
    }

    return await this.findById(profile.userId);
  }

  async create(provider: Provider | string, profile: BaseUserInfo) {
    // тут должен быть вызов к бд, но я просто сделал моки
    const user: User = {
      userId: this.mockedUsers.length + 1,
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
    };

    const userAccount: Account = {
      userId: user.userId,
      provider: provider as Provider,
      providerAccountId: profile.id,
      access_token: profile.access_token,
      refresh_token: profile.refresh_token,
    };

    this.mockedUsers.push(user);
    this.mockedUsersProvidersAccounts.push(userAccount);

    return user;
  }
}
