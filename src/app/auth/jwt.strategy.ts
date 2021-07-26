import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@common/interfaces';
import { ConfigApp } from '@config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<ConfigApp['secretKey']>('app.secretKey'),
    });
  }

  async validate(payload: JwtPayload) {
    const credential = await this.authService.validate(payload);
    if (!credential) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return credential;
  }
}
