import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Copy, Check } from 'lucide-react'; 

interface CodeSolutionProps {
  answer: string;
  setAnswer: (value: string) => void;
  language?: string;
}

const CodeSolution: React.FC<CodeSolutionProps> = ({ 
  answer, 
  setAnswer, 
  language = 'python' 
}) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [copied, setCopied] = useState(false);

  const languageDisplay = language === 'python' ? 'Python 3.11' : language;

  const copyToClipboard = () => {
    if (answer) {
      navigator.clipboard.writeText(answer)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  useEffect(() => {
    if (editorContainerRef.current) {
      editorRef.current = monaco.editor.create(editorContainerRef.current, {
        value: answer,
        language,
        theme: 'vs-light',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'hse-sans, Menlo, Monaco, "Courier New", monospace',
        lineNumbers: 'on',
        lineNumbersMinChars: 3, 
        glyphMargin: false, 
        folding: false,
        roundedSelection: false,
        renderLineHighlight: 'none', 
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: 'hidden',
          horizontal: 'auto', 
          verticalScrollbarSize: 0,
          horizontalScrollbarSize: 8,
          alwaysConsumeMouseWheel: false
        },
      });

      editorRef.current.onDidChangeModelContent(() => {
        if (editorRef.current) {
          const value = editorRef.current.getValue();
          setAnswer(value);
        }
      });

      return () => {
        if (editorRef.current) {
          editorRef.current.dispose();
        }
      };
    }
  }, [language]); 

  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== answer) {
        editorRef.current.setValue(answer);
      }
    }
  }, [answer]);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-600">{languageDisplay}</div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-1" />
          ) : (
            <Copy className="w-4 h-4 mr-1" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div 
          ref={editorContainerRef} 
          className="w-full min-h-[300px] rounded bg-gray-50"
        />
      </div>
    </div>
  );
};

export default CodeSolution;