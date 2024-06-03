import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { UserLoggedSchema } from "@/schemas";

export const usersRouter = createTRPCRouter({
  on_logged: publicProcedure
    .input(UserLoggedSchema)
    .query(async ({ ctx, input }) => {
      console.log(ctx.headers);
      return input.id;
    }),
});
