import { useCurrentTask } from "@/pages/CompetitionSession/providers/session-provider.tsx";
import { TaskType } from "@/shared/types/task.ts";
import { useQuery } from "@tanstack/react-query";
import { useSolutions } from "@/pages/CompetitionSession/providers/solution-provider.tsx";
import { ofetch } from "ofetch";
import { CodeAnswer } from "@/pages/CompetitionSession/widgets/answers/code.tsx";
import { InputAnswer } from "@/pages/CompetitionSession/widgets/answers/input.tsx";
import { FileAnswer } from "@/pages/CompetitionSession/widgets/answers/file.tsx";

const fetchSettings = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
};

export const SolutionAnswer = () => {
  const { task } = useCurrentTask();
  const { currentSolution } = useSolutions();

  const contentQuery = useQuery({
    queryKey: ["submission", currentSolution?.id],
    queryFn: async () => {
      if (!currentSolution) {
        return null;
      }

      return await ofetch(currentSolution.content, {
        parseResponse: (txt) => txt,
      });
    },
    enabled:
      !!currentSolution && [TaskType.INPUT, TaskType.CODE].includes(task.type),
    ...fetchSettings,
  });

  const fileQuery = useQuery({
    queryKey: ["submission", currentSolution?.id],
    queryFn: async () => {
      if (!currentSolution) {
        return null;
      }

      return await ofetch(currentSolution.content, { responseType: "blob" });
    },
    enabled: !!currentSolution && task.type === TaskType.FILE,
    ...fetchSettings,
  });

  switch (task.type) {
    case TaskType.INPUT:
      return (
        <InputAnswer
          content={contentQuery.data}
          isLoading={contentQuery.isLoading}
        />
      );
    case TaskType.CODE:
      return (
        <CodeAnswer
          content={contentQuery.data}
          isLoading={contentQuery.isLoading}
        />
      );
    case TaskType.FILE:
      return (
        <FileAnswer
          fetchedFile={fileQuery.data}
          isLoading={fileQuery.isLoading}
          filename={currentSolution?.content.split("/").at(-1)}
        />
      );
  }
};
