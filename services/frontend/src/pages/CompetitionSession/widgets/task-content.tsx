import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import { useCurrentTask } from "../providers/session-provider.tsx";
import { TaskContentAttachments } from "./task-content-attachments.tsx";

export const TaskContent = () => {
  const { task } = useCurrentTask();

  return (
    <div className="min-w-0 flex-1">
      <h2 className="text-5xl font-semibold">{task.title}</h2>

      <div className="prose prose-xl text-foreground mt-10 min-w-full text-pretty">
        <Markdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {task.description}
        </Markdown>
      </div>

      <TaskContentAttachments />
    </div>
  );
};
