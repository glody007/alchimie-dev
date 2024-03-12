import { api } from "~/trpc/server"
import { Submission } from "./submission"
import { EmptyPlaceholder } from "../ui/empty"

interface Props {
    challengeId: string
}

export default async function SubmissionList({ challengeId }: Props) {
    const submissions = await api.challenge.getSubmissions.query({ challengeId })
    
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {submissions.length > 0 ? (
                <>
                    {submissions.map(submission => (
                        <Submission key={submission.id} submission={submission} />
                    ))}
                </>
            ) : (
                <EmptyPlaceholder className="col-span-full">
                    <EmptyPlaceholder.Description>
                        Aucune publication pour l&apos;instant
                    </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
            )}
        </div>
    )
}