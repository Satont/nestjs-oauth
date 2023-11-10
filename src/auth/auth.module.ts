import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ProvidersModule } from '../providers/providers.module';
import { ConfigService } from '@nestjs/config';
import { GithubProvider } from '../providers/services/githubProvider';
import { GoogleProvider } from '../providers/services/googleProvider';
import { YandexProvider } from '../providers/services/yandexProvider';
import { VkProvider } from '../providers/services/vkProvider';

@Module({
  imports: [
    UsersModule,
    ProvidersModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          baseUrl: configService.get('API_BASE')!,
          services: [
            new GithubProvider({
              client_id: configService.get('GITHUB_CLIENT_ID')!,
              client_secret: configService.get('GITHUB_CLIENT_SECRET')!,
              scopes: ['read:user', 'user:email'],
            }),
            new GoogleProvider({
              client_id: configService.get('GOOGLE_CLIENT_ID')!,
              client_secret: configService.get('GOOGLE_CLIENT_SECRET')!,
              scopes: ['profile', 'email'],
            }),
            new YandexProvider({
              client_id: configService.get('YANDEX_CLIENT_ID')!,
              client_secret: configService.get('YANDEX_CLIENT_SECRET')!,
              scopes: ['login:email'],
            }),
            new VkProvider({
              client_id: configService.get('VK_CLIENT_ID')!,
              client_secret: configService.get('VK_CLIENT_SECRET')!,
              scopes: ['email'],
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
