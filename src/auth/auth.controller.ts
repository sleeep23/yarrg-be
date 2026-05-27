import { Controller, Get, Query, Redirect, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator';
import { JwtAuthGuard } from './guard';

import type { AuthenticatedUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Get('gistory')
  @Redirect()
  redirectToGistory() {
    return {
      url: this.authService.buildGistoryAuthorizeUrl(),
      statusCode: 302,
    };
  }

  @Get('gistory/callback')
  async gistoryCallback(@Query('code') code: string) {
    return this.authService.gistoryLogin(code);
  }
}
