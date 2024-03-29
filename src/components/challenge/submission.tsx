import { format } from "date-fns"
import Image from "next/image"
import type { RouterOutputs } from "~/trpc/shared"
import { SubmissionVisualizer } from "./submission-visualizer"
import { SubmissionLikeButton } from "./submission-like-button"

interface Props {
    submission: RouterOutputs["challenge"]["getSubmissions"][number]
}

export function Submission({ submission }: Props) {    
    const userImage =  submission.user.image
    return (
        <div className="gap-2 border rounded-xl">
            <div className="h-64 bg-muted rounded-t-xl">
                <SubmissionVisualizer 
                    codeGroup={submission.group} 
                    className="rounded-t-xl"
                />
            </div>
            <div className="w-full flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    {userImage && (
                        <Image 
                            width={32}
                            height={32}
                            src={userImage} alt={`Submission ${submission.user.name}`}
                            className="rounded-full"
                        />
                    )}
                    <div>
                        <h3 className="text-sm font-semibold">{submission.user.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {format(submission.submittedAt, "dd MMM yyyy hh:mm")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <SubmissionLikeButton 
                        submissionId={submission.id} 
                        liked={submission.likes.length > 0} 
                    />
                    <p className="text-sm">{submission._count.likes}</p>
                </div>
            </div>
        </div>
    )
}