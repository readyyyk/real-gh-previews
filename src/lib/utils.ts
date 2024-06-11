import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GH_COOKIE_ATTRS_STR, GH_COOKIE_NAME } from '@/config';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getClientCookie(name: string): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }
    const raw = document.cookie
        .split('; ')
        .map((a) => a.split('='))
        .flat();
    const foundIndex = raw.findIndex((a) => a === name);
    return foundIndex === -1 ? undefined : raw[foundIndex + 1];
}

export function setAuthCookie(name: string, value: string) {
    if (typeof document === 'undefined') {
        return undefined;
    }

    document.cookie = GH_COOKIE_NAME + '=' + value + '; ' + GH_COOKIE_ATTRS_STR;
}
