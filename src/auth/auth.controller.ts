import { Controller, Get, Query, Redirect, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator';
import { JwtAuthGuard } from './guard';

import type { AuthenticatedUser } from './types';
import {
  ApiBearerAuth,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthUserResponseDto, LoginResponseDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthUserResponseDto })
  @ApiOperation({ summary: '현재 로그인한 사용자 정보 조회' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Get('gistory')
  @Redirect()
  @ApiOperation({ summary: 'Gistory 로그인 페이지로 리다이렉트' })
  @ApiFoundResponse({
    description: 'Gistory authorize URL로 리다이렉트합니다.',
  })
  redirectToGistory() {
    return {
      url: this.authService.buildGistoryAuthorizeUrl(),
      statusCode: 302,
    };
  }

  @Get('gistory/callback')
  @ApiOperation({ summary: 'Gistory callback 처리 후 YarrG access token 발급' })
  @ApiOkResponse({ type: LoginResponseDto })
  async gistoryCallback(@Query('code') code: string) {
    return this.authService.gistoryLogin(code);
  }
}
