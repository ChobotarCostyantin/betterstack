import ky from 'ky';

export const apiClient = ky.create({
    prefixUrl: process.env.BACKEND_BASE_URL ?? 'http://localhost:3010/api/v1',
    credentials: 'include',
});
