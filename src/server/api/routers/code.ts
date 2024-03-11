import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const codeRouter = createTRPCRouter({
  // TO DO: optimize db query
  updateSolutionCodes: protectedProcedure
    .input(z.object({
        codes: z.array(
            z.object({
                id: z.string(),
                body: z.string()
            })
        )
    }))
    .mutation(async ({ ctx, input }) => {
      let solutionId = undefined

      for(const inputCode of input.codes) {
        const code = await ctx.db.code.findFirst({
            where: {
                id: inputCode.id
            },
            include: {
                group: {
                    include: {
                        challengeSolution: true
                    }
                }
            }
        })

        if(!code) throw new TRPCError({
            code: "NOT_FOUND",
            message: "Code not found"
        })

        if(
            code.group?.challengeSolution?.userId !== 
            ctx.session.user.id
        ) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You don't have access to this code"
            })
        }

        solutionId = code.group.challengeSolution.id

        await ctx.db.code.update({
            where: {
                id: inputCode.id
            },
            data: {
                body: inputCode.body
            }
        })

      }

      if(solutionId) {
        await ctx.db.challengeSolution.update({
            where: {
                id: solutionId
            },
            data: {
                updatedAt: new Date()
            }
        })
      }

      return null

    }),

    // TO DO: optimize db query
    submitSolution: protectedProcedure
        .input(z.object({
            solutionGroupeId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const solutionGroupe = await ctx.db.codeGroup.findFirst({
                where: {
                    id: input.solutionGroupeId
                },
                include: {
                    codes: true,
                    challengeSolution: true
                }
            })


            if(!solutionGroupe) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Groupe not found"
            })

            const challengeSolution = solutionGroupe.challengeSolution

            if(!challengeSolution) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Challenge solution not found"
            })

            if(
                challengeSolution.userId !== 
                ctx.session.user.id
            ) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You don't have access to this code"
                })
            }

            const existingSubmission = await ctx.db.challengeSubmission.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    challengeId: challengeSolution.challengeId
                },
                include: {
                    group: {
                        include: {
                            codes: true
                        }
                    }
                }
            })

            if(existingSubmission) {
                const updates = existingSubmission.group.codes.map(code => {
                    const solutionCode = solutionGroupe.codes.find(solutionCode => code.languageId === solutionCode.languageId)

                    if(!solutionCode) throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Code not found"
                    })

                    return ctx.db.code.update({
                        where: {
                            id: code.id
                        },
                        data: {
                            body: solutionCode.body
                        }
                    })
                })

                await ctx.db.$transaction(updates)

                return  ctx.db.challengeSubmission.update({
                    where: {
                        id: existingSubmission.id
                    },
                    data: {
                        submittedAt: new Date()
                    }
                })

                return existingSubmission
            }

            const submissionGroup = await ctx.db.codeGroup.create({
                data: {
                  codes: {
                    create: solutionGroupe.codes.map(code => ({
                        body: code.body,
                        languageId: code.languageId
                    }))
                  }
                }
            })

            return await ctx.db.challengeSubmission.create({
                data: {
                    userId: ctx.session.user.id,
                    challengeId: challengeSolution.challengeId,
                    groupeId: submissionGroup.id
                }
            })

        }),
    
});
