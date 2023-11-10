import { BaseService, BaseUserInfo, ProviderOpts } from './base';

export class GoogleProvider extends BaseService {
  constructor(opts: ProviderOpts) {
    super({
      name: 'google',

      authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
      access_url: 'https://oauth2.googleapis.com/token',
      profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',

      scopes: opts.scopes,
      client_id: opts.client_id,
      client_secret: opts.client_secret,
    });
  }

  extractUserInfo(data: GoogleProfile): BaseUserInfo {
    return super.extractUserInfo({
      id: data.sub,
      avatarUrl: data.picture,
      name: data.name,
      email: data.email,
    });
  }
}

interface GoogleProfile extends Record<string, any> {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name?: string;
  given_name: string;
  hd?: string;
  iat: number;
  iss: string;
  jti?: string;
  locale?: string;
  name: string;
  nbf?: number;
  picture: string;
  sub: string;
}
