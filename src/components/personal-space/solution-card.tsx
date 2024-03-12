import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/trpc/shared";

interface SolutionCardProps {
    solution: RouterOutputs["challenge"]["getUserSolutions"]["solutions"][number]
}

export function SolutionCard({ solution }: SolutionCardProps) {
    return (
        <Link 
            href={`/challenge/solution/${solution.id}`}  
            className="max-w-sm flex flex-col border hover:shadow-md"
        >
            <div className="relative h-72">
                <Image 
                    src={solution.challenge.image} 
                    alt={solution.challenge.name} 
                    fill
                    objectFit="cover"
                />
            </div>
            <div className="flex flex-col gap-2 p-4">
                <h3 className="font-semibold">{solution.challenge.name}</h3>
                <p className="text-sm text-muted-foreground">{solution.challenge.description}</p>
            </div>
        </Link>
    )
}