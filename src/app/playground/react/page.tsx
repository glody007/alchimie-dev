"use client"

import React, { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";



export default function Playground() {
  const monaco = useMonaco();
  const [code, setCode] = useState('')

  useEffect(() => {
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);

  function handleChange(value?: string) {
    setCode(value || '')
  }

  return (
    <div className="h-screen grid grid-cols-6">
        <div className="col-span-3">
            <Editor 
                defaultValue="// some comment" 
                defaultLanguage="html" 
                theme="vs-dark"
                onChange={handleChange}
            />
        </div>
        <div className="h-full col-span-3">
            <LiveProvider code={code}>
                <LivePreview />
            </LiveProvider>
        </div>
    </div>
  );
}