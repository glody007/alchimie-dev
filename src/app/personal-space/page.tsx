import Link from "next/link"
import { SolutionCard } from "~/components/personal-space/solution-card"
import { buttonVariants } from "~/components/ui/button"
import { EmptyPlaceholder } from "~/components/ui/empty"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/server"

export default async function PersonalSpaceHomePage() {
    const data = await api.challenge.getMySolutions.query() 

    return (
        <div className="w-full p-4 py-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold">Mes solutions</h1>
                    <Link 
                        href="/"
                        className={cn(buttonVariants({ variant: "default" }))}
                    >
                        New challenge
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.solutions.length > 0 ? (
                        <>
                            {data.solutions.map((solution) => (
                                <SolutionCard key={solution.id} solution={solution} />
                            ))}
                        </>
                    ) : (
                        <EmptyPlaceholder className="col-span-full">
                            <EmptyPlaceholder.Description>
                                Vous n'avez aucun challenge
                            </EmptyPlaceholder.Description>
                        </EmptyPlaceholder>
                    )}

                </div>
            </div>
        </div>
    )
}