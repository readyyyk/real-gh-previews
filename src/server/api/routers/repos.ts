import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '@/server/api/trpc';
import { image_source_variants, tbl_repos } from '@/server/db/schema';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

const UpdateSourceSchema = z
    .object({
        repo_gh_id: z.number(),
        image_source: z.enum(image_source_variants),
        custom_link: z.string().url().optional(),
    })
    .refine((value) => {
        return value.image_source === 'custom_link'
            ? !!value.custom_link?.length
            : true;
    });

const repos_router = createTRPCRouter({
    get_sources: publicProcedure
        .input(z.object({ user_id: z.number() }))
        .query(async ({ ctx, input }) => {
            type Response = Record<
                number,
                {
                    image_source: 'default' | 'custom_link';
                    custom_link: string | null;
                }
            >;

            const result = await ctx.db
                .select()
                .from(tbl_repos)
                .where(eq(tbl_repos.user_gh_id, input.user_id));

            return result.reduce((acc, el) => {
                acc[el.repo_gh_id] = {
                    image_source: el.image_source,
                    custom_link: el.custom_link,
                };
                return acc;
            }, {} as Response);
        }),

    update_source: privateProcedure
        .input(UpdateSourceSchema)
        .mutation(async ({ ctx, input }) => {
            const resultUpdate = await ctx.db
                .update(tbl_repos)
                .set({
                    image_source: input.image_source,
                    custom_link: input.custom_link,
                })
                .where(
                    and(
                        eq(tbl_repos.repo_gh_id, input.repo_gh_id),
                        eq(tbl_repos.user_gh_id, ctx.user.id),
                    ),
                );

            if (resultUpdate.rowsAffected === 0) {
                // const resultInsert =
                await ctx.db.insert(tbl_repos).values({
                    user_gh_id: ctx.user.id,
                    repo_gh_id: input.repo_gh_id,
                    image_source: input.image_source,
                    custom_link: input.custom_link,
                });
            }
        }),
});

export default repos_router;
