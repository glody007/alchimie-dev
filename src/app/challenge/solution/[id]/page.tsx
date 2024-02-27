import { api } from "~/trpc/server"

interface Props {
    params: {
        id: string
    }
}

export default async function ChallengeSolutionPage({ params }: Props) {
    const solution = await api.challenge.solution.query({ solutionId: params.id })

    return (
        <div className="flex min-h-screen justify-center items-center container mx-auto">
            <p className="text-muted-foreground text-sm">User ID: {solution.userId} --&gt; Challenge ID: {solution.challengeId}</p>
        </div>
    )
}