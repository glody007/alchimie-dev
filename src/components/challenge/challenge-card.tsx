"use client"

import Image from "next/image"
import { useCountdown } from "~/lib/hooks/use-countdown"
import { RouterOutputs } from "~/trpc/shared"
import { ChallengeRegisterButton } from "./challenger-register-button"
import Link from "next/link"
import { cn } from "~/lib/utils"
import { buttonVariants } from "~/components/ui/button"

interface Props {
  challenge: RouterOutputs["challenge"]["getAll"][number],
  showDetailButton?: Boolean
}

export function ChallengeCard({ challenge, showDetailButton }: Props) {
  const [hours, minutes, secondes] = useCountdown(challenge.end)

  return (
      <div className="flex flex-col gap-4 p-12 bg-muted rounded-lg">
        <div className="relative w-[400px] h-[400px]">
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
            <p className="first-letter:uppercase text-sm text-muted-foreground">
              {challenge.description}
            </p>
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
  )
}