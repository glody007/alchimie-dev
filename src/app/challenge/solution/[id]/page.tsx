"use client"

import { VanillaEditor } from "~/components/editor/vanilla-editor"
import { api } from "~/trpc/react"


interface Props {
    params: {
        id: string
    }
}

export default function ChallengeSolutionPage({ params }: Props) {
    const { data, isLoading } =  api.challenge.solution.useQuery({ solutionId: params.id })
    
    if(isLoading) return <div className="flex min-h-screen justify-center items-center">Loading...</div>

    if(!data) return <div className="flex min-h-screen justify-center items-center">Error...</div>
    
    return (
        <VanillaEditor codeGroup={data.group} />
    )
}