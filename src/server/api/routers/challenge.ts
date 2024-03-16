import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.challenge.findMany()
    }),

  getById: publicProcedure
    .input(z.object({ challengeId: z.string()}))
    .query(async ({ ctx, input }) => {
      const challenge = await ctx.db.challenge.findFirst({
        where: {
          id: input.challengeId
        }
      })

      return challenge;
    }),

  getTodayChallenge: publicProcedure
    .query(async ({ ctx }) => {
      const now = new Date()
      const todayChallenge = await ctx.db.challenge.findFirst({
        where: {
          start: { 
            lte: now
          },
          end: { 
            gte: now
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

  getSolution: publicProcedure
    .input(z.object({ solutionId: z.string()}))
    .query(async ({ ctx, input }) => {
      const solution = await ctx.db.challengeSolution.findFirst({
        where: { id: input.solutionId },
        include: {
          challenge: true,
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

  // TO DO: add admin access and pagination
  getUserSolutions: protectedProcedure
    .input(z.object({ userId: z.string()}))
    .query(async ({ ctx, input }) => {
      const solutions = await ctx.db.challengeSolution.findMany({
        where: {
          userId: input.userId
        },
        include: {
          challenge: true
        }
      })

      return {
        solutions
      }
    }),

  getMySolutions: protectedProcedure
    .query(async ({ ctx }) => {
      const { user } = ctx.session
      const solutions = await ctx.db.challengeSolution.findMany({
        where: {
          userId: user.id
        },
        include: {
          challenge: true
        }
      })

      return {
        solutions
      }
    }),

  getSubmissions: publicProcedure
    .input(z.object({ challengeId: z.string() }))
    .query(async ({ ctx, input }) => {
 
      const userId = ctx.session?.user.id ?? ""

      const submissions = await ctx.db.challengeSubmission.findMany({
        where: {
          challengeId: input.challengeId
        },
        include: {
          user: true,
          _count: {
            select: {
              likes: true
            }
          },
          likes: {
            where: {
              userId: userId
            },
          },
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

      return submissions
    }),

  toggleSubmissionLike: protectedProcedure
    .input(z.object({ challengeSubmissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const existingLike = await ctx.db.challengeSubmissionLike.findFirst({
        where: {
          userId: user.id,
          challengeSubmissionId: input.challengeSubmissionId
        }
      })

      if(existingLike) {
        await ctx.db.challengeSubmissionLike.delete({
          where: {
            id: existingLike.id
          }
        })

        return null
      }

      return await ctx.db.challengeSubmissionLike.create({
        data: {
          userId: user.id,
          challengeSubmissionId: input.challengeSubmissionId
        }
      })
    })

});
