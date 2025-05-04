import React from "react";
import { Editor } from "@monaco-editor/react";
import { Check, Copy, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useSolutions } from "@/pages/CompetitionSession/providers/solution-provider.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

interface CodeAnswerProps {
  content?: string;
  isLoading: boolean;
}

export const CodeAnswer = ({ content, isLoading }: CodeAnswerProps) => {
  const { answer, updateValue } = useSolutions();
  const [isMounting, setIsMounting] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading) {
      updateValue(content || "");
    }
  }, [content, isLoading, updateValue]);

  return (
    <div className={"bg-card relative overflow-hidden rounded-md"}>
      {(isLoading || isMounting) && (
        <div
          className={
            "bg-card absolute top-0 left-0 z-10 flex h-[400px] w-full items-center justify-center rounded-md"
          }
        >
          <Spinner />
        </div>
      )}

      <div className={"bg-card flex justify-between border-b px-4 py-3"}>
        <span className={"text-muted-foreground text-sm"}>Python 3.11</span>
        <div className="flex items-center gap-4">
          <InfoDialog />
          <ClipboardCopyButton value={answer.value} />
        </div>
      </div>

      <Editor
        loading
        value={answer.value}
        onMount={() => setIsMounting(false)}
        onChange={(v) => updateValue(v || "")}
        height={400}
        language={"python"}
        options={{
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: "hidden",
          },
          stickyScroll: {
            enabled: false,
          },
          lineNumbersMinChars: 4,
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          renderLineHighlight: "none",
          dragAndDrop: true,
          dropIntoEditor: {
            enabled: true,
          },
          fontFamily: "Monaco",
          fontSize: 16,
          padding: {
            top: 10,
          },
        }}
      />
    </div>
  );
};

const ClipboardCopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [value]);

  return (
    <button
      className="flex cursor-pointer items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
      title="Cкопировать код"
      onClick={copy}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};

const InfoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex cursor-pointer items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
          title="Информация о среде выполнения"
        >
          <Info className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Информация о среде выполнения
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-7">
          <div className={"flex flex-col gap-5"}>
            <h3 className="text-lg font-semibold">Ограничение ресурсов</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="mt-0.5 mr-3 rounded-full bg-yellow-100 p-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                </div>
                1 попытка в 10 секунд
              </li>
              <li className="flex items-start">
                <div className="mt-0.5 mr-3 rounded-full bg-yellow-100 p-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                </div>
                Ограничение памяти: 4 МБ
              </li>
              <li className="flex items-start">
                <div className="mt-0.5 mr-3 rounded-full bg-yellow-100 p-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                </div>
                Ограничение времени: 60 секунд
              </li>
              <li className="flex items-start">
                <div className="mt-0.5 mr-3 rounded-full bg-yellow-100 p-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                </div>
                Ограничение ОЗУ: 512 МБ
              </li>
            </ul>
          </div>

          <div className={"flex flex-col gap-5"}>
            <h3 className="text-lg font-semibold">Доступные библиотеки</h3>
            <div className="rounded-md bg-gray-50 p-4 font-mono text-sm">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">pandas</span>
                  <span className="ml-2 text-gray-500">2.2.3</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">numpy</span>
                  <span className="ml-2 text-gray-500">2.2.3</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">
                    matplotlib
                  </span>
                  <span className="ml-2 text-gray-500">3.10.1</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">scipy</span>
                  <span className="ml-2 text-gray-500">1.15.2</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">
                    scikit-learn
                  </span>
                  <span className="ml-2 text-gray-500">1.6.1</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">seaborn</span>
                  <span className="ml-2 text-gray-500">0.13.2</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">
                    statsmodels
                  </span>
                  <span className="ml-2 text-gray-500">0.14.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
