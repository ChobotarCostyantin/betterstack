import ky from 'ky';
import { cookies } from 'next/headers';

export async function createServerClient() {
    const cookieStore = await cookies();
    return ky.create({
        prefixUrl:
            process.env.BACKEND_BASE_URL ?? 'http://localhost:3010/api/v1',
        hooks: {
            beforeRequest: [
                (request) => {
                    const cookie = cookieStore.toString();
                    if (cookie) request.headers.set('Cookie', cookie);
                },
            ],
        },
    });
}
