import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { image_source_variants, tbl_repos } from '@/server/db/schema';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { GH_COOKIE_NAME } from '@/config';
import { TRPCError } from '@trpc/server';
import { Octokit } from '@octokit/rest';

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

// TODO move user auth logic to protected procedure
const repos_router = createTRPCRouter({
    get_sources: publicProcedure.query(async ({ ctx }) => {
        /* start of protected procedure */
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
        /* end of protected procedure */

        const result = await ctx.db
            .select()
            .from(tbl_repos)
            .where(eq(tbl_repos.user_gh_id, userResult.data.id));

        return result.reduce(
            (acc, el) => {
                acc[el.repo_gh_id] = {
                    image_source: el.image_source,
                    custom_link: el.custom_link,
                };
                return acc;
            },
            {} as Record<
                number,
                {
                    image_source: 'default' | 'custom_link';
                    custom_link: string | null;
                }
            >,
        );
    }),

    update_source: publicProcedure
        .input(UpdateSourceSchema)
        .mutation(async ({ ctx, input }) => {
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

            const resultUpdate = await ctx.db
                .update(tbl_repos)
                .set({
                    image_source: input.image_source,
                    custom_link: input.custom_link,
                })
                .where(
                    and(
                        eq(tbl_repos.repo_gh_id, input.repo_gh_id),
                        eq(tbl_repos.user_gh_id, userResult.data.id),
                    ),
                );

            if (resultUpdate.rowsAffected === 0) {
                const resultInsert = await ctx.db.insert(tbl_repos).values({
                    user_gh_id: userResult.data.id,
                    repo_gh_id: input.repo_gh_id,
                    image_source: input.image_source,
                    custom_link: input.custom_link,
                });
            }
        }),
});

export default repos_router;
