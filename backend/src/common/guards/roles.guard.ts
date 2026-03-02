import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/roles.decorator';
import { Role, RoleWeight } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRole) return true;

        const { user } = context.switchToHttp().getRequest();

        const userWeight = RoleWeight[user.role as Role] || 0;
        const requiredWeight = RoleWeight[requiredRole];

        if (userWeight < requiredWeight) {
            throw new ForbiddenException('Forbidden');
        }

        return true;
    }
}