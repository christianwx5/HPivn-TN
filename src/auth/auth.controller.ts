import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { IAuthRequest } from 'src/interfaces/auth-request.interface';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard, JwtRefreshGuard, LocalAuthGuard } from './guards';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Request() req: IAuthRequest) {
    const newReg = await this.authService.register(req.body);
    if (newReg)
      return {
        status: 'OK',
        message: 'Usuario creado satisfactoriamente',
        data: newReg,
      };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: IAuthRequest) {
    const { user } = req;
    const access = await this.authService.login(user);
    await this.userService.setCurrentRefreshToken(
      access.tokens.refresh_token,
      user._id,
    );
    return access;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: IAuthRequest) {
    const { user } = req;
    const logoutResponse = await this.userService.removeRefreshToken(
      user.userId,
    );

    if (logoutResponse)
      return {
        status: 'OK',
        message: 'Sesión finalizada satisfactoriamente!',
      };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refreshToken(@Request() req: IAuthRequest) {
    const { user } = req;
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      companies: user.companies,
    };
    const token = await this.authService.getJwtAccessToken(payload);
    return {
      tokens: {
        access_token: token,
      },
    };
  }
}
