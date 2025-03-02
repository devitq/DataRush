import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Task } from "@/shared/types";

interface TaskContentProps {
  task: Task;
}

const TaskContent: React.FC<TaskContentProps> = ({ task }) => {
  return (
    <div className="flex-1 bg-white rounded-lg p-6">
      <h2 className="text-3xl font-semibold mb-6 font-hse-sans">
        Задача {task.number}
      </h2>
      
      <div className="prose prose-lg max-w-none text-gray-700 font-hse-sans">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {task.description}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default TaskContent;
