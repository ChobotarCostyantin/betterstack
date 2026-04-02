const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://betterstack.tech';

export function absoluteUrl(path: string) {
    return new URL(path, BASE_URL);
}
