import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Challenge } from "~/components/challenge/challenge"
import { Header } from "~/components/challenge/header"
import SubmissionList from "~/components/challenge/submission-list"
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
        <main className="flex flex-col min-h-screen divide-y">
            <Header />
            <div className="p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-10">
                    <div className="grid lg:grid-cols-2 gap-4">
                        <Challenge 
                            challenge={challenge} 
                        /> 
                        <div className="space-y-2">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Challenge {challenge.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                            </div> 
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold">Publications</h1>
                        <Suspense fallback={(
                            <div className="flex min-h-screen justify-center items-center">
                                Loading...
                            </div>
                        )}>
                            <SubmissionList challengeId={challenge.id} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    )
}