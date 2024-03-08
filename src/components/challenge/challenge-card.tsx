"use client"

import Image from "next/image"
import { useCountdown } from "~/lib/hooks/use-countdown"
import { RouterOutputs } from "~/trpc/shared"
import { ChallengeRegisterButton } from "./challenger-register-button"

interface Props {
  challenge: RouterOutputs["challenge"]["all"][number]
}

export function ChallengeCard({ challenge }: Props) {
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
        <div className="flex flex-col justify-start gap-2">
          <p className="first-letter:uppercase text-sm text-muted-foreground">
            {challenge.description}
          </p>
          <div>
              <ChallengeRegisterButton challengeId={challenge.id} />
          </div>
        </div>
      </div>
  )
}