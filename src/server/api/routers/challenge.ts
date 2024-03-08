import { TRPCError } from "@trpc/server";
import { endOfToday, startOfToday } from "date-fns";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  all: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.challenge.findMany()
    }),

  todayChallenge: publicProcedure
    .query(async ({ ctx }) => {
      const todayChallenge = await ctx.db.challenge.findFirst({
        where: {
          start: { 
            gte: startOfToday(),
            lte: endOfToday()
          }
        }
      })

      return todayChallenge;
    }),

  register: protectedProcedure
    .input(z.object({ challengeId: z.string()}))
    .mutation(async ({ ctx, input }) => {
      const challenge = await ctx.db.challenge.findFirst({
        where: {
          id: input.challengeId
        },
        select: {
          id: true,
          languages: true
        }
      })

      if(!challenge) throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge introuvable"
      })

      const existingSolution = await ctx.db.challengeSolution.findFirst({
        where: {
          userId: ctx.session.user.id,
          challengeId: challenge.id
        }
      })

      if(existingSolution) return existingSolution

      const codes = challenge.languages.map((language) => ({
        body: "",
        languageId: language.id,
      }))

      const group = await ctx.db.codeGroup.create({
        data: {
          codes: {
            create: codes
          }
        }
      })

      return await ctx.db.challengeSolution.create({
        data: {
          userId: ctx.session.user.id,
          challengeId: challenge.id,
          groupeId: group.id
        }
      })

    }),
    
  solution: publicProcedure
    .input(z.object({ solutionId: z.string()}))
    .query(async ({ ctx, input }) => {
      const solution = await ctx.db.challengeSolution.findFirst({
        where: { id: input.solutionId },
        include: {
          group: {
            include: {
              codes: {
                include: {
                  language: true
                }
              }
            }
          }
        }
      })

      if(!solution) throw new TRPCError({
        code: "NOT_FOUND",
        message: "Solution introuvable"
      })

      return solution;
    }),
});
