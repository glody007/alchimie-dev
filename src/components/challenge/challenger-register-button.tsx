"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"
import { Icons } from "../icons"

interface Props {
    challengeId: string
}

export function ChallengeRegisterButton({ challengeId }: Props) {
    const { data: session } = useSession()
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const { mutate, isLoading } = api.challenge.register.useMutation({
        onSuccess: (data) => {
            startTransition(() => {
                router.push(`/challenge/solution/${data.id}`)
                console.log("created")
            })
        },
        onError: () => {
            console.log("something went wrong")
        }
    })

    const register = () => {
        if(session) {
            mutate({ challengeId })
        } else {
            router.push("/api/auth/signin")
        }
    }

    return (
        <Button size="lg" onClick={register}>
            {(isLoading || isPending) && (<Icons.spinner className="mr-2 size-4 animate-spin" />)}
            Start
        </Button>
    )
}