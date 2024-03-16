"use client"

import { api } from "~/trpc/react"
import { Icons } from "../shared/icons"
import { Button } from "../ui/button"
import { signIn, useSession } from "next-auth/react"
import { useToast } from "../ui/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "~/lib/utils"

export function SubmissionLikeButton({
    submissionId,
    liked=false
} : {
    submissionId: string,
    liked?: boolean
}) {
    const { data: session } = useSession()
    const { toast } = useToast()
    const router = useRouter()
    const { mutate, isLoading } = api.challenge.toggleSubmissionLike.useMutation()

    function toggleLike() {
        mutate({
          challengeSubmissionId: submissionId  
        }, {
            onError: () => {
                toast({ 
                    title: "Ooops!",
                    description: "Une erreur est survenue",
                    variant: "destructive"
                })
            }, 
            onSuccess: () => {
                router.refresh()
            }
        })
    }

    function toggleIfConnected() {
        if(session) {
            toggleLike()
        } else {
            void signIn()
        }
    }

    return (
        <Button 
            variant="secondary" 
            className={cn(
                "size-8 p-0 rounded-full",
                {"bg-primary hover:bg-primary text-background": liked}
            )}
            onClick={toggleIfConnected}
        >
            <Icons.heart className="size-4" />
        </Button>
    )
}