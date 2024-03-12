"use client"

import React, { useEffect, useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { Hook, Console, Unhook } from "console-feed";
import type { RouterOutputs } from '~/trpc/shared';
import { Button, buttonVariants } from '../ui/button';
import { api } from '~/trpc/react';
import { Icons } from '../icons';
import Link from 'next/link';
import { cn } from '~/lib/utils';
import Image from 'next/image';

interface Props {
  codeGroup: RouterOutputs["challenge"]["getSolution"]["group"]
  challengeImage?: string
}

export function VanillaEditor({ codeGroup, challengeImage }: Props) {
  const monaco = useMonaco();
  const logRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("")
  const [css, setCss] = useState("")
  const [js, setJs] = useState("");
  const [jsDoc, setJsDoc] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<any>([]);
  const [canBeSubmitted, setCanBeSubmitted] = useState(false)
  const [canBeSaved, setCanBeSaved] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [showChallenge, setShowChallenge] = useState(false)

  const { mutate: updateCodes, isLoading: isSaving } = api.code.updateSolutionCodes.useMutation({
    onSuccess: () => {
      console.log("Success")
      setCanBeSubmitted(true)
      setCanBeSaved(false)
    },
    onError: () => {
      console.log("something went wrong")
    }
  })

  const { mutate: submitSolution, isLoading: isSubmitting } = api.code.submitSolution.useMutation({
    onSuccess: () => {
      console.log("Success")
      setCanBeSubmitted(false)
    },
    onError: () => {
      console.log("something went wrong")
    }
  })

  // run once!
  useEffect(() => {
    const onMessage = function(event: MessageEvent) {
      console.log("Message received from the child: " + event.data); // Message received from child
    }
      
    window.addEventListener('message', onMessage);
    const hookedConsole = Hook(
      window.console,
      (log) => setLogs((currLogs: any) => [...currLogs, log]),
      false
    )
    return () => {
      window.removeEventListener('message', onMessage);
      Unhook(hookedConsole)
    }
  }, [])

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

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    logRef.current?.scrollIntoView({behavior: 'auto'});
    
  }, [logs]);

  useEffect(() => {
    let modified = false
    for(const code of codeGroup.codes) {
      if(
        (code.language.name === "html" && code.body !== html) ||
        (code.language.name === "css" && code.body !== css) ||
        (code.language.name === "javascript" && code.body !== js)
      ) {
        modified = true 
      }
    }
    setCanBeSaved(modified)

    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html lang="en">
          <body>${html}</body>
          <style>${css}</style>
          <script>${jsDoc}</script>
        </html>
      `);

      
    }, 200);

    return () => clearTimeout(timeout);
  }, [html, css, js, jsDoc, codeGroup.codes]);

  useEffect(() => {
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);

  function handleChangeHtml(value?: string) {
    setHtml(value ?? '')
  }

  function handleChangeCss(value?: string) {
    setCss(value ?? '')
  }

  function handleChangeJs(value?: string) {
    const jsDoc = `
      const log = console.log.bind(console)
      try {
        console.log = (...args) => {
          window.parent.postMessage(...args, "*");
          log(...args)
        }
        ${value}
      } catch(e) {
        window.parent.postMessage(e, "*");
      }
    `
    if(value) {
      setJsDoc(jsDoc)
    }
    setJs(value ?? '')
  }

  function toggleConsole() {
    setShowConsole(state => !state)
  }

  function toggleShowChallenge() {
    setShowChallenge(state => !state)
  }

  function save() {
    updateCodes({
      codes: codeGroup.codes.map((code) => {
        if(code.language.name === "javascript") {
          return {
            id: code.id,
            body: js
          }
        }
        
        if (code.language.name === "css") {
          return {
            id: code.id,
            body: css
          }
        } 

        if (code.language.name === "html") {
          return {
            id: code.id,
            body: html
          }
        }

        return {
          id: code.id,
          body: ""
        }
      })
    })
  }

  function submit() {
    submitSolution({ 
      solutionGroupeId: codeGroup.id 
    })
  }

  return (
    <div className='h-screen flex flex-col divide-y'>
      <div className='flex justify-between items-center p-2 bg-foreground/90'>
        <div>
          <Link 
            href="/personal-space"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Espace personel
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <Button 
            size="lg" 
            onClick={save} 
            disabled={isSaving || !canBeSaved}
          >
            {isSaving && (<Icons.spinner className="mr-2 size-4 animate-spin" />)}
            Enregistrer
          </Button>
          <Button 
            size="lg"   
            variant="destructive" 
            onClick={submit}
            disabled={isSubmitting || !canBeSubmitted}
          >
            {isSubmitting && (<Icons.spinner className="mr-2 size-4 animate-spin" />)}
            Soumettre
          </Button>
        </div>
      </div>
      <ResizablePanelGroup 
        direction="vertical"
        className='flex-1'
      >
        <ResizablePanel 
          defaultSize={30}
        >
          <ResizablePanelGroup 
            direction="horizontal"
            className='h-full bg-foreground/90'
          >
            <ResizablePanel 
              defaultSize={25}
            >
              <div className="h-full">
                <div className='pl-8 text-sm text-background font-semibold'>
                  HTML
                </div>
                <Editor 
                  defaultValue={html}
                  defaultLanguage="html" 
                  theme="vs-dark"
                  onChange={handleChangeHtml}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel 
              defaultSize={25}
            >
              <div className="h-full">
                <div className='pl-8 text-sm text-background font-semibold'>
                  CSS
                </div>
                <Editor 
                  defaultValue={css}
                  defaultLanguage="css" 
                  theme="vs-dark"
                  onChange={handleChangeCss}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel 
              defaultSize={25}
            >
              <div className="h-full">
                <div className='pl-8 text-sm text-background font-semibold'>
                  JS
                </div>
                <Editor 
                  defaultValue={js}
                  defaultLanguage="javascript" 
                  theme="vs-dark"
                  onChange={handleChangeJs}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel 
          defaultSize={30}
        >
          <ResizablePanelGroup 
            direction="horizontal"
            className='h-full'
          >
            <ResizablePanel 
              defaultSize={66}
            >
              <div className="h-full">
                <iframe
                  srcDoc={srcDoc}
                  title="output"
                  sandbox="allow-scripts"
                  frameBorder="0"
                  height="100%"
                  width="100%"
                />
              </div>
            </ResizablePanel>
            {(showChallenge && challengeImage) && (
              <>
                <ResizableHandle />
                <ResizablePanel 
                  defaultSize={33}
                >
                  <div className="h-full bg-background overflow-scroll">
                    <div className="relative w-[200px] sm:w-[400px] h-[400px]">
                      <Image src={challengeImage} alt="challenge image" fill />
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
        {showConsole && (
          <>
            <ResizableHandle />
            <ResizablePanel 
              defaultSize={20}
            >
              <div className="h-full overflow-y-scroll" style={{ backgroundColor: '#242424' }}>
                <Console logs={logs} variant="dark" />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      <div className='flex justify-between items-center p-2 bg-foreground/90'>
        <div className='flex gap-2'>
          <Button variant="secondary" size="sm" onClick={toggleConsole}>
            Console
          </Button>
          <Button variant="secondary" size="sm" onClick={toggleShowChallenge}>
            Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}