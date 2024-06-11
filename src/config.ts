// import { createSecretKey } from "crypto";

export const SALT_ROUNDS = 10;
export const JWT_EXP_TIME = 60 * 15;
export const JWT_SECRET = 'very_very(secret*code';

// export const JWT_SIGN_VALUE = createSecretKey(JWT_SECRET, "utf-8");

export const GH_COOKIE_NAME = 'Authentication';

export const GH_COOKIE_ATTRS = Object.freeze({
    // httpOnly: true,
    // "same-site": true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // One month
    path: '/',
});

export const GH_COOKIE_ATTRS_STR = Object.entries(GH_COOKIE_ATTRS).reduce(
    (acc, el) => {
        if (el[1] === false) return acc;
        const value = el[1] !== true ? '=' + el[1] : '';
        return acc + el[0] + value + '; ';
    },
    '',
);
