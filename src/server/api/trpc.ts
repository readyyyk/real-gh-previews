/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { db } from '@/server/db';
import { GH_COOKIE_NAME } from '@/config';
import { Octokit } from '@octokit/rest';
import type { Endpoints } from '@octokit/types';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        ...opts,
        db: db,
        cookies: (opts.headers.get('cookie') ?? '').split(';').reduce(
            (acc, value) => {
                return acc.set(...(value.split('=') as [string, string]));
            },
            new Map() as Map<string, string>,
        ),
        user: null as null | Endpoints['GET /user']['response']['data'],
    };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

export const privateProcedure = publicProcedure.use(async ({ ctx, next }) => {
    const access_token = ctx.cookies.get(GH_COOKIE_NAME);

    if (!access_token) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const userResult = await new Octokit({ auth: access_token })
        .request('GET /user')
        .catch((e) => ({ error: e as unknown }));

    if ('error' in userResult) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: String(userResult.error),
        });
    }

    return next({
        ctx: {
            user: userResult.data,
        },
    });
});
