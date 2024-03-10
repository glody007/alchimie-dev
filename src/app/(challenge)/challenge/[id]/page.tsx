import { notFound } from "next/navigation"
import { ChallengeCard } from "~/components/challenge/challenge-card"
import { Header } from "~/components/challenge/header"
import { api } from "~/trpc/server"


interface Props {
    params: {
        id: string
    }
}

export default async function ChallengePage({ params }: Props) {
    const challenge = await  api.challenge.getById.query({ challengeId: params.id})

    if(!challenge) notFound()

    return (
        <main className="flex min-h-screen flex-col">
            <Header />
            <div className="container grid md:grid-cols-2">
                <ChallengeCard 
                    challenge={challenge} 
                /> 
            </div>
        </main>
    )
}