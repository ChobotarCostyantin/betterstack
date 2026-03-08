import { Request } from 'express';
import { Role } from '../enums/role.enum.js';

export interface JwtPayload {
    id: number;
    email: string;
    role: Role;
}

export type AuthenticatedRequest = Request & { user: JwtPayload };
