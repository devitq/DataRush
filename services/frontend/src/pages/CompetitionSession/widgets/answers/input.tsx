import React from "react";
import { useSolutions } from "@/pages/CompetitionSession/providers/solution-provider.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

interface InputAnswerProps {
  content?: string;
  isLoading: boolean;
}

export const InputAnswer = ({ content, isLoading }: InputAnswerProps) => {
  const { answer, updateValue } = useSolutions();

  React.useEffect(() => {
    if (!isLoading) {
      updateValue(content || "");
    }
  }, [content, isLoading, updateValue]);

  if (isLoading) {
    return (
      <div className="bg-card flex h-13 w-full items-center justify-center rounded-md">
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <input
      className="bg-card h-13 rounded-md px-5 py-3 text-lg outline-0"
      placeholder="Введите ответ"
      value={answer.value}
      onChange={(e) => updateValue(e.target.value)}
    />
  );
};
