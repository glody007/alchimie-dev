"use client"

import React, { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';


export default function Playground() {
  const monaco = useMonaco();
  const [html, setHtml] = useState('<div></div>')
  const [css, setCss] = useState(`div {
    width: 200px;
    height: 200px;
    border-radius: 20px;
    background-color: blue;
  }`)
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");

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
    setHtml(value || '')
  }
  function handleChangeCss(value?: string) {
    setCss(value || '')
  }

  return (
    <div className="h-screen grid grid-cols-6">
        <div className="col-span-2">
            <Editor 
                defaultValue={html}
                defaultLanguage="javascript" 
                theme="vs-dark"
                onChange={handleChangeHtml}
            />
        </div>
        <div className="h-full col-span-2">
            <Editor 
                defaultValue={css}
                defaultLanguage="css" 
                theme="vs-dark"
                onChange={handleChangeCss}
            />
        </div>
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
    </div>
  );
}