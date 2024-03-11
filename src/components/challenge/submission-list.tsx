import { api } from "~/trpc/server"
import { Submission } from "./submission"

interface Props {
    challengeId: string
}

export default async function SubmissionList({ challengeId }: Props) {
    const submissions = await api.challenge.getSubmissions.query({ challengeId })
    
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {submissions.map(submission => (
                <Submission key={submission.id} submission={submission} />
            ))}
        </div>
    )
}