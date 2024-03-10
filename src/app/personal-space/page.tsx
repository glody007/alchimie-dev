import { SolutionCard } from "~/components/personal-space/solution-card"
import { api } from "~/trpc/server"

export default async function PersonalSpaceHomePage() {
    const data = await api.challenge.mySolutions.query() 

    return (
        <div className="w-full p-4 py-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Mes solutions</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.solutions.map((solution) => (
                        <SolutionCard key={solution.id} solution={solution} />
                    ))}
                </div>
            </div>
        </div>
    )
}