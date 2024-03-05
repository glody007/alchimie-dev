"use client"

import React, { useEffect, useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { Hook, Console, Decode, Unhook } from "console-feed";
import { RouterOutputs } from '~/trpc/shared';
import { Button } from '../ui/button';
import { api } from '~/trpc/react';
import { Icons } from '../icons';

interface Props {
  codeGroup: RouterOutputs["challenge"]["solution"]["group"],
}

export function VanillaEditor({ codeGroup }: Props) {
  const monaco = useMonaco();
  const logRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("")
  const [css, setCss] = useState("")
  const [js, setJs] = useState("");
  const [jsDoc, setJsDoc] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<any>([]);

  const { mutate, isLoading } = api.code.updateSolutionCodes.useMutation({
    onSuccess: (data) => {
      console.log("Success")
    },
    onError: () => {
        console.log("something went wrong")
    }
  })

  useEffect(() => {
  
  }, []);

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
  }, [html, css, jsDoc]);

  useEffect(() => {
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);

  function handleChangeHtml(value?: string) {
    setHtml(value || '')
  }

  function handleChangeCss(value?: string) {
    setCss(value || '')
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
      setJs(value)
      setJsDoc(jsDoc)
    }
  }

  function save() {
    mutate({
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

  return (
    <div className='h-screen flex flex-col divide-y'>
      <div className='flex justify-between items-center p-4 bg-foreground/90'>
        <div></div>
        <div className='flex items-center'>
          <Button size="lg" onClick={save}>
          {isLoading && (<Icons.spinner className="mr-2 size-4 animate-spin" />)}
            Enregistrer
          </Button>
        </div>
      </div>
      <ResizablePanelGroup 
        direction="vertical"
        className='flex-1'
      >
        <ResizablePanel 
          defaultSize={60}
        >
          <ResizablePanelGroup 
            direction="horizontal"
            className='h-full'
          >
            <ResizablePanel 
              defaultSize={25}
            >
              <div className="h-full">
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
          <div className="h-full col-span-2">
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
        <ResizableHandle />
        <ResizablePanel 
          defaultSize={20}
        >
          <div className="h-full overflow-y-scroll" style={{ backgroundColor: '#242424' }}>
            <Console logs={logs} variant="dark" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}