import { SetMetadata } from '@nestjs/common';
import { Role } from '@common/enums/role.enum';

export const ROLE_KEY = 'roles';
export const WithRole = (role: Role) => SetMetadata(ROLE_KEY, role);
