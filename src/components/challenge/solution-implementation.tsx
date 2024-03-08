import { VanillaEditor } from "~/components/editor/vanilla-editor"
import { api } from "~/trpc/server"

interface Props {
    solutionId: string
}

export async function SolutionImplementation({ solutionId }: Props) {
    const solution =  await api.challenge.solution.query({ solutionId })
    
    return (
        <VanillaEditor codeGroup={solution.group} />
    )
}