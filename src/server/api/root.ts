import { usersRouter } from '@/server/api/routers/users';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import repos_router from '@/server/api/routers/repos';

export const appRouter = createTRPCRouter({
    users: usersRouter,
    repos: repos_router,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
