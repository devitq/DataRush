import { blobToFile, getPrettySize } from "@/shared/lib/utils";
import { Download, File, FileUp } from "lucide-react";
import React from "react";
import { useSolutions } from "../../providers/solution-provider";
import { Loading } from "@/components/ui/loading";

import { v4 as uuidv4 } from "uuid";

const displayedExtensions = [
  "jpeg",
  "png",
  "docx",
  "xlsx",
  "pptx",
  "pdf",
  "txt",
];
const extensions = [...displayedExtensions, "jpg", "doc", "xls", "ppt"];

interface FileAnswerProps {
  fetchedFile?: Blob | null;
  isLoading: boolean;
  filename?: string;
}

export const FileAnswer = ({
  fetchedFile,
  isLoading,
  filename,
}: FileAnswerProps) => {
  const { answer, updateFile } = useSolutions();

  const link = React.useMemo(
    () => (answer.file ? URL.createObjectURL(answer.file) : undefined),
    [answer.file],
  );

  React.useEffect(() => {
    if (fetchedFile) {
      updateFile(blobToFile(fetchedFile, filename ?? uuidv4()));
    }
  }, [fetchedFile, filename, updateFile]);

  if (isLoading) {
    return (
      <div className="bg-card relative h-[300px] rounded-md">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-card relative flex h-[300px] flex-col items-center justify-center gap-4 rounded-md p-4">
      {!answer.file ? (
        <>
          <input
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            type="file"
            accept={extensions.map((ext) => `.${ext}`).join(",")}
            onChange={(e) => updateFile(e.target.files?.[0] || null)}
          />
          <FileUp />
          <div className="bg-primary rounded-full px-4 py-2">
            Загрузить файл
          </div>
          <p className="text-muted-foreground absolute bottom-4 text-sm">
            Доступные форматы: {displayedExtensions.join(", ")}
          </p>
        </>
      ) : (
        <>
          <a download={answer.file.name} href={link} target="_blank">
            <div className="bg-muted flex w-full max-w-56 items-center gap-3 rounded-md border px-3 py-3 transition-transform active:scale-[0.95]">
              <File size={22} className="min-w-fit" />
              <div className="flex w-full flex-col gap-1 overflow-hidden">
                <p className="overflow-hidden text-sm overflow-ellipsis whitespace-nowrap">
                  {answer.file.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {getPrettySize(answer.file.size)}
                </p>
              </div>
              <Download className="text-muted-foreground" />
            </div>
          </a>
          <button
            onClick={() => updateFile(null)}
            className="bg-muted absolute bottom-4 cursor-pointer rounded-full border px-4 py-2 text-sm transition-transform active:scale-[0.9]"
          >
            Сбросить
          </button>
        </>
      )}
    </div>
  );
};
