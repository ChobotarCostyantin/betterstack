import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { authConfig, type AuthConfig } from '@config/auth.config';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(authConfig.KEY)
        auth: AuthConfig,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) =>
                    (req?.cookies as Record<string, string>)?.[
                        auth.cookieName
                    ] ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: auth.jwtSecret,
        });
    }

    validate(payload: JwtPayload): JwtPayload {
        return payload;
    }
}
