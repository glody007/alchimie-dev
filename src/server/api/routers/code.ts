import { TRPCError } from "@trpc/server";
import { endOfToday, startOfToday } from "date-fns";
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

        await ctx.db.code.update({
            where: {
                id: inputCode.id
            },
            data: {
                body: inputCode.body
            }
        })

      }

      return null

    }),
    
});
