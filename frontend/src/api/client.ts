import ky from 'ky';

export const apiClient = ky.create({
    prefixUrl: process.env.BACKEND_BASE_URL,
    credentials: 'include',
});
