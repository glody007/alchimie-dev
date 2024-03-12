"use client"

import { type HtmlHTMLAttributes, useEffect, useState } from "react"
import type { RouterOutputs } from "~/trpc/shared"

interface Props extends HtmlHTMLAttributes<HTMLIFrameElement> {
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
}