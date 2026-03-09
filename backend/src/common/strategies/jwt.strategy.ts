import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { ConfigType } from '@nestjs/config';
import { authConfig } from '@config/auth.config';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(authConfig.KEY)
        auth: ConfigType<typeof authConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) =>
                    (req?.cookies as Record<string, string>)?.access_token ??
                    null,
            ]),
            ignoreExpiration: false,
            secretOrKey: auth.jwtSecret,
        });
    }

    validate(payload: JwtPayload): JwtPayload {
        return payload;
    }
}
