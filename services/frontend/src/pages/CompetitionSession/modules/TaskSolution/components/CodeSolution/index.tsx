import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Copy, Check, Info } from 'lucide-react'; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        <div className="flex items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <button 
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                title="Информация о среде выполнения"
              >
                <Info className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Информация о среде выполнения</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Ограничение ресурсов</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="bg-yellow-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      </div>
                      Максимум 1 посылка в 10 секунд
                    </li>
                    <li className="flex items-start">
                      <div className="bg-yellow-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      </div>
                      Максимальный размер решения 4MB
                    </li>
                    <li className="flex items-start">
                      <div className="bg-yellow-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      </div>
                      Максимальное время работы программы 1 минута
                    </li>
                    <li className="flex items-start">
                      <div className="bg-yellow-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      </div>
                      Выделяется 512MB на решение
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Доступные библиотеки</h3>
                  <div className="bg-gray-50 p-4 rounded-md font-mono text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-semibold">pandas</span>
                        <span className="text-gray-500 ml-2">2.2.3</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-semibold">numpy</span>
                        <span className="text-gray-500 ml-2">2.2.3</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-semibold">matplotlib</span>
                        <span className="text-gray-500 ml-2">3.10.1</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-semibold">scipy</span>
                        <span className="text-gray-500 ml-2">1.15.2</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-semibold">scikit-learn</span>
                        <span className="text-gray-500 ml-2">1.6.1</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-semibold">seaborn</span>
                        <span className="text-gray-500 ml-2">0.13.2</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-600 font-semibold">statsmodels</span>
                        <span className="text-gray-500 ml-2">0.14.4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <button 
            onClick={copyToClipboard}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            title="Копировать код"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
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