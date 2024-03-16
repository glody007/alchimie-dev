import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Icons } from "../shared/icons";
import Image from "next/image";


export function ShowChallengeModal({ 
    showChallengeModal, 
    setShowChallengeModal ,
    image
}: {
    showChallengeModal: boolean
    setShowChallengeModal: Dispatch<SetStateAction<boolean>>,
    image: string
}) {
    return (
        <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
            <DialogContent className="sm:max-w-full h-screen flex justify-center items-center">
                <Image 
                    src={image} 
                    alt="Challenge image fullscreen" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    objectFit="contain"
                    width={500}
                    height={500}
                />
            </DialogContent>
        </Dialog>
    )
}

export function ShowChallengeButton({
    setShowChallengeModal
}:{
    setShowChallengeModal: Dispatch<SetStateAction<boolean>>  
}) {
    return (
        <div>
            <Button 
                onClick={() => setShowChallengeModal(true)}
                variant="outline"
                className="rounded-full p-2 size-12"
            >
                <Icons.fullScreen className="size-4 " />
            </Button>
        </div>
    )
}

export function useShowChallengeModal({
    image
} : { 
    image: string
}) {
    const [showChallengeModal, setShowChallengeModal] = useState(false)

    const ShowChallengeModalCallback = useCallback(() => {
        return (
            <ShowChallengeModal
                showChallengeModal={showChallengeModal} 
                setShowChallengeModal={setShowChallengeModal}
                image={image}
            />
        )
    }, [showChallengeModal, setShowChallengeModal, image])

    const ShowChallengeButtonCallback = useCallback(() => {
        return (
            <ShowChallengeButton setShowChallengeModal={setShowChallengeModal} />
        )
    }, [setShowChallengeModal])

    return useMemo(() => {
        return {
            setShowChallengeModal,
            ShowChallengeButton: ShowChallengeButtonCallback,
            ShowChallengeModal: ShowChallengeModalCallback
        }
    }, [setShowChallengeModal, ShowChallengeModalCallback, ShowChallengeButtonCallback])
}