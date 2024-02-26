"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"

interface Props {
    challengeId: string
}

export function ChallengeRegisterButton({ challengeId }: Props) {
    const { data: session } = useSession()
    const router = useRouter()

    const register = () => {
        if(session) {
            console.log("Logged in", challengeId)
        } else {
            router.push("/api/auth/signin")
        }
    }

    return (
        <Button size="lg" onClick={register}>
            Start
        </Button>
    )
}