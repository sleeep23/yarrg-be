import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  GistoryTokenResponse,
  GistoryUserInfoResponse,
  JwtPayload,
} from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async issueAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  buildGistoryAuthorizeUrl() {
    const authorizeUrl = this.configService.getOrThrow<string>(
      'GISTORY_AUTHORIZE_URL',
    );
    const clientId = this.configService.getOrThrow<string>('GISTORY_CLIENT_ID');
    const redirectUri = this.configService.getOrThrow<string>(
      'GISTORY_REDIRECT_URI',
    );
    const scopes = this.configService.getOrThrow<string>('GISTORY_SCOPES');
    const codeChallenge = this.configService.getOrThrow<string>(
      'GISTORY_CODE_CHALLENGE',
    );

    const url = new URL(authorizeUrl);
    url.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes,
      code_challenge: codeChallenge,
      code_challenge_method: 'plain',
    }).toString();

    return url.toString();
  }

  async gistoryLogin(code: string) {
    if (!code) throw new BadRequestException('인가 코드가 없습니다.');
    const tokenResponse = await this.exchangeGistoryCode(code);
    const userInfo = await this.fetchGistoryUserInfo(
      tokenResponse.access_token,
    );
    const payload: JwtPayload = {
      sub: userInfo.sub,
      displayName: userInfo.name,
    };
    const accessToken = await this.issueAccessToken(payload);
    return { accessToken };
  }

  // login helper
  private async exchangeGistoryCode(
    code: string,
  ): Promise<GistoryTokenResponse> {
    const clientId = this.configService.getOrThrow<string>('GISTORY_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow<string>(
      'GISTORY_CLIENT_SECRET',
    );
    const tokenUrl = this.configService.getOrThrow<string>('GISTORY_TOKEN_URL');
    const codeVerifier = this.configService.getOrThrow<string>(
      'GISTORY_CODE_CHALLENGE',
    );
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok)
      throw new UnauthorizedException('Gistory 토큰 발급에 실패했습니다.');

    return response.json() as Promise<GistoryTokenResponse>;
  }

  private async fetchGistoryUserInfo(accessToken: string) {
    const userInfoUrl = this.configService.getOrThrow<string>(
      'GISTORY_USERINFO_URL',
    );
    const response = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok)
      throw new UnauthorizedException(
        'Gistory 유저 정보를 가져오는데 실패했습니다.',
      );

    return response.json() as Promise<GistoryUserInfoResponse>;
  }
}
