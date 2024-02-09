import { TRPCError } from "@trpc/server";
import { endOfToday, startOfToday } from "date-fns";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  todayChallenge: publicProcedure
    .query(async ({ ctx }) => {
      const todayChallenge = await ctx.db.challenge.findFirst({
        where: {
            day: { 
              gte: startOfToday(),
              lte: endOfToday()
            }
        }
      })

      if(!todayChallenge) throw new TRPCError({
        code: "NOT_FOUND",
        message: "Pas de challenge aujourd'hui"
      })

      return todayChallenge;
    }),
});
