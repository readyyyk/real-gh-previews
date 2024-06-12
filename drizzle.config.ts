import { type Config } from 'drizzle-kit';

import { env } from '@/env';

export default {
    schema: './src/server/db/schema.ts',
    out: './drizzle/migrations',
    dialect: 'sqlite',
    driver: 'turso',
    dbCredentials: {
        url: env.DATABASE_URL,
        authToken: env.DATABASE_TOKEN,
    },
    tablesFilter: ['*'],
} satisfies Config;
