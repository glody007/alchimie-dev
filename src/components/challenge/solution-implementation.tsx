import { VanillaEditor } from "~/components/editor/vanilla-editor"
import { api } from "~/trpc/server"

interface Props {
    solutionId: string
}

export async function SolutionImplementation({ solutionId }: Props) {
    const solution =  await api.challenge.getSolution.query({ solutionId })
    
    return (
        <VanillaEditor 
            codeGroup={solution.group} 
            challengeImage={solution.challenge.image}
        />
    )
}