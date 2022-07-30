import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from 'src/config/app/configuration.service';
import { ITokenPayload } from 'src/interfaces/token-payload.interface';
import { ComparePassword } from 'src/libs';
import { CreateUserDTO } from 'src/users/dto';
import { UserDocument } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async login(user: any): Promise<any> {
    const payload: ITokenPayload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      companies: user.companies,
    };

    return {
      email: user.email,
      sub: user._id,
      role: user.role,
      tokens: {
        access_token: await this.getJwtAccessToken(payload),
        expiresIn: this.appConfigService.jwtAccessExpirationTime,
        refresh_token: await this.getJwtRefreshToken(payload),
      },
    };
  }

  async register(user: CreateUserDTO): Promise<UserDocument> {
    const userAccount: any = await this.userService.create(user);
    const { password, __v, ...result } = userAccount._doc;
    return result;
  }

  async getJwtAccessToken(payload: ITokenPayload): Promise<string> {
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtAccessSecret,
      expiresIn: this.appConfigService.jwtAccessExpirationTime,
    });
    return token;
  }

  async getJwtRefreshToken(payload: ITokenPayload): Promise<string> {
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: this.appConfigService.jwtRefreshExpirationTime,
    });
    return token;
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOne(email);
      if (!user.status) throw new ForbiddenException();

      const isMatch = await ComparePassword(user.password, password);
      if (isMatch) {
        await this.userService.updateOnLogin(user._id);
        return user;
      }

      return null;
    } catch (error) {
      if (error.status === 403)
        throw new ForbiddenException(
          'Cuenta deshabilitada, contacta a un administrador!',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async getAllPermissionsOfUser(user: any): Promise<UserDocument> {
    return this.userService.getUserPermissions(user.userId);
  }
}
