import { Request } from 'express';
import { Role } from '@common/enums/role.enum';

export interface JwtPayload {
    id: number;
    email: string;
    role: Role;
}

export type AuthenticatedRequest = Request & { user: JwtPayload };
