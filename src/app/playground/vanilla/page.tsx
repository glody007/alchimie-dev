"use client"

import React, { useEffect, useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { Hook, Console, Unhook } from "console-feed";

export default function Playground() {
  const monaco = useMonaco();
  const logRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState('<div></div>')
  const [css, setCss] = useState(`div {
    width: 200px;
    height: 200px;
    border-radius: 20px;
    background-color: blue;
  }`)
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<any>([]);

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
    // 👇️ scroll to bottom every time messages change
    logRef.current?.scrollIntoView({behavior: 'auto'});
    
  }, [logs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html lang="en">
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 200);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

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
    if(value) setJs(jsDoc)
  }

  return (
    <div className='h-screen'>
      <ResizablePanelGroup 
        direction="vertical"
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