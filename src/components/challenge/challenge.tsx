"use client"

import Image from "next/image"
import { useCountdown } from "~/lib/hooks/use-countdown"
import type { RouterOutputs } from "~/trpc/shared"
import { ChallengeRegisterButton } from "./challenge-register-button"
import Link from "next/link"
import { cn } from "~/lib/utils"
import { buttonVariants } from "~/components/ui/button"
import { useShowChallengeModal } from "./show-challenge-modal"

interface Props {
  challenge: RouterOutputs["challenge"]["getAll"][number],
  showDetailButton?: boolean
}

export function Challenge({ challenge, showDetailButton }: Props) {
  const [hours, minutes, secondes] = useCountdown(challenge.end)
  const { ShowChallengeButton, ShowChallengeModal } = useShowChallengeModal({ 
    image: challenge.image
  })

  return (
      <div className="relative flex justify-center p-12 bg-muted rounded-lg">
         <ShowChallengeModal />
          <div className="absolute top-4 right-4 z-10">
            <ShowChallengeButton  />
          </div>
        <div className="space-y-4 w-full">
          <div className="relative w-[200px] sm:w-[400px] h-[400px]">
            <Image src={challenge.image} alt={challenge.description} fill />
            <div className="absolute inset-x-0 bottom-2">
              <div className="flex justify-center">
                <p className="text-foreground text-center px-4 py-2 rounded-full bg-background shadow-2xl">
                  Se termine dans {' '}
                  <span>
                    {`${hours}`.padStart(2, '0')}:
                    {`${minutes}`.padStart(2, '0')}:
                    {`${secondes}`.padStart(2, '0')}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4 gap-4">
            <div>
              <h3 className="font-semibold">
                {challenge.name}
              </h3>
            </div>
            <div className="space-x-2">
              <ChallengeRegisterButton challengeId={challenge.id} />
              {showDetailButton && (
                <Link 
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                  href={`/challenge/${challenge.id}`}
                >
                  Details
                </Link>
              )}
            </div>
          </div>
        </div>
        
      </div>
  )
}