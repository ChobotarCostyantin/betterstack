export enum Role {
    USER = 'user',
    AUTHOR = 'author',
    ADMIN = 'admin',
}
export const RoleWeight: Record<Role, number> = {
    [Role.USER]: 1,
    [Role.AUTHOR]: 2,
    [Role.ADMIN]: 3,
};
