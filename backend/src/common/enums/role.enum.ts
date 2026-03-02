export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}
export const RoleWeight: Record<Role, number> = {
    [Role.USER]: 1,
    [Role.ADMIN]: 2,
};