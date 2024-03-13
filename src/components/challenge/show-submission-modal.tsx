import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Icons } from "../shared/icons";


export function ShowSubmissionModal({ 
    showSubmissionModal, 
    setShowSubmissionModal,
    children
}: {
    showSubmissionModal: boolean
    setShowSubmissionModal: Dispatch<SetStateAction<boolean>>,
    children?: React.ReactNode
}) {
    return (
        <Dialog 
            open={showSubmissionModal} 
            onOpenChange={setShowSubmissionModal}
        >
            <DialogContent className="sm:max-w-full h-screen">
                {children}
            </DialogContent>
        </Dialog>
    )
}

export function ShowSubmissionButton({
    setShowSubmissionModal
}:{
    setShowSubmissionModal: Dispatch<SetStateAction<boolean>>  
}) {
    return (
        <div>
            <Button 
                onClick={() => setShowSubmissionModal(true)}
                variant="outline"
                className="rounded-full p-2 size-12"
            >
                <Icons.fullScreen className="size-4 " />
            </Button>
        </div>
    )
}

export function useShowSubmissionModal({
    content
} : { 
    content: React.ReactNode
}) {
    const [showSubmissionModal, setShowSubmissionModal] = useState(false)

    const ShowSubmissionModalCallback = useCallback(() => {
        return (
            <ShowSubmissionModal
                showSubmissionModal={showSubmissionModal} 
                setShowSubmissionModal={setShowSubmissionModal}
            >
                {content}
            </ShowSubmissionModal>
        )
    }, [showSubmissionModal, setShowSubmissionModal])

    const ShowSubmissionButtonCallback = useCallback(() => {
        return (
            <ShowSubmissionButton setShowSubmissionModal={setShowSubmissionModal} />
        )
    }, [setShowSubmissionModal])

    return useMemo(() => {
        return {
            setShowSubmissionModal,
            ShowSubmissionButton: ShowSubmissionButtonCallback,
            ShowSubmissionModal: ShowSubmissionModalCallback
        }
    }, [setShowSubmissionModal, ShowSubmissionModalCallback, ShowSubmissionButtonCallback])
}