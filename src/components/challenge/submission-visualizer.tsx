"use client"

import { type HtmlHTMLAttributes, useEffect, useState, useCallback } from "react"
import type { RouterOutputs } from "~/trpc/shared"
import { useShowSubmissionModal } from "./show-submission-modal"

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
    codeGroup: RouterOutputs["challenge"]["getSubmissions"][number]["group"]
}

export function SubmissionVisualizer({ codeGroup, className }: Props) {
    const [srcDoc, setSrcDoc] = useState('')
    const [html, setHtml] = useState("")
    const [css, setCss] = useState("")
    const [js, setJs] = useState("");

    useEffect(() => {
        setSrcDoc(`
            <html lang="en">
                <body>${html}</body>
                <style>${css}</style>
                <style>
                    html, body {
                        pointer-events: none;
                    }
                </style>
                <script>${js}</script>
            </html>
        `);
    }, [html, css, js])

    useEffect(() => {
        for(const code of codeGroup.codes) {
          if(code.language.name === "html") {
            setHtml(code.body)
          } else if (code.language.name === "css") {
            setCss(code.body)
          } else if (code.language.name === "javascript") {
            setJs(code.body)
          }
        }
    }, [codeGroup]);

    const Iframe = useCallback(() => {
        return (
            <iframe
                className={className}
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="0"
                height="100%"
                width="100%"
            />
        )
    }, [srcDoc])

    const { ShowSubmissionButton, ShowSubmissionModal } = useShowSubmissionModal({ 
        content: <Iframe /> 
    })

    return (
        <div 
            className="relative h-full" 
        >
            <ShowSubmissionModal />
            <div className="absolute top-4 right-4">
                <ShowSubmissionButton  />
            </div>
            <iframe
                className={className}
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="0"
                height="100%"
                width="100%"
            />
        </div>
    )
}