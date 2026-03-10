import ky from 'ky';

export const browserClient = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    credentials: 'include',
});
