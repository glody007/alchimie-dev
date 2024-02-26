import Image from "next/image"
import { RouterOutputs } from "~/trpc/shared"
import { ChallengeRegisterButton } from "./challenger-register-button"

interface Props {
    challenge: RouterOutputs["challenge"]["todayChallenge"]
}

export function ChallengeCard({ challenge }: Props) {

    return (
        <div className="flex flex-col gap-4">
          <div className="relative w-[400px] h-[400px] rounded bg-slate-300 border">
            <Image src={challenge.image} alt={challenge.description} fill />
          </div>
          <div className="flex flex-col justify-start gap-2">
            <p className="first-letter:uppercase text-sm font-light">{challenge.description}</p>
            <div>
                <ChallengeRegisterButton challengeId={challenge.id} />
            </div>
          </div>
        </div>
    )
}