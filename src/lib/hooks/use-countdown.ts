"use client"

import { differenceInSeconds } from "date-fns"
import { useEffect, useState } from "react"

const MINUTE_TO_SECONDS = 60
const HOUR_TO_SECONDS = 3600

export function useCountdown(deadline: Date) {
    const [countdownInSeconds, setCountdownInSeconds] = useState(differenceInSeconds(deadline, new Date()))
    
    useEffect(() => {
      const interval = setInterval(() => {
        setCountdownInSeconds(() => differenceInSeconds(deadline, new Date()))
      }, 1000)
  
      return () => clearTimeout(interval)
    }, [deadline])

    const hours = Math.floor(countdownInSeconds / HOUR_TO_SECONDS)

    const hoursInSeconds = hours * HOUR_TO_SECONDS

    const minutes = Math.floor(
        (countdownInSeconds - hoursInSeconds) / MINUTE_TO_SECONDS
    )

    const minutesInSecondes = minutes * MINUTE_TO_SECONDS

    const secondes = Math.floor(
        countdownInSeconds - hoursInSeconds - minutesInSecondes
    )

    return [hours, minutes, secondes] as const 
}