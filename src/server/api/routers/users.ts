import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

import { UserLoggedSchema } from '@/schemas';
import { tbl_users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const usersRouter = createTRPCRouter({
    on_logged: publicProcedure
        .input(UserLoggedSchema)
        .query(async ({ ctx, input }) => {
            const selectResult = await ctx.db.query.tbl_users.findFirst({
                columns: { gh_id: true },
                where: eq(tbl_users.gh_id, input.id),
            });

            if (selectResult) {
                return true;
            }

            const insertResult = await ctx.db
                .insert(tbl_users)
                .values({ gh_id: input.id });
            return !!insertResult.lastInsertRowid;
        }),
});
