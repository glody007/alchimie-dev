import { Suspense } from "react"
import { SolutionImplementation } from "~/components/challenge/solution-implementation"

interface Props {
    params: {
        id: string
    }
}

export default async function ChallengeSolutionPage({ params }: Props) {

    return (
        <Suspense fallback={(
            <div className="flex min-h-screen justify-center items-center">
                Loading...
            </div>
        )}>
            <SolutionImplementation solutionId={params.id} />
        </Suspense>
    )
}