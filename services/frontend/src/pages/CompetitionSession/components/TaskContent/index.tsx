import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Task } from '@/shared/types/task';
import { useQuery } from '@tanstack/react-query';
import { getTaskAttachments } from '@/shared/api/session';
import { FileIcon, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface TaskContentProps {
  task: Task;
}

const TaskContent: React.FC<TaskContentProps> = ({ task }) => {
  const { id: competitionId } = useParams<{ id: string }>();

  const attachmentsQuery = useQuery({
    queryKey: ['taskAttachments', competitionId, task.id],
    queryFn: () => getTaskAttachments(competitionId || '', task.id),
    enabled: !!(competitionId && task.id),
  });

  const attachments = attachmentsQuery.data || [];

  return (
    <div className="flex-1 bg-white rounded-lg p-6">
      <h2 className="text-3xl font-semibold mb-6 font-hse-sans">
        {task.title}
      </h2>
      
      <div className="prose prose-lg max-w-none text-gray-700 font-hse-sans mb-6">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {task.description}
        </ReactMarkdown>
      </div>

      {attachmentsQuery.isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500 font-hse-sans">Загрузка файлов...</span>
        </div>
      ) : attachments.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 font-hse-sans">Прикрепленные файлы</h3>
          <div className="flex flex-col gap-2">
            {attachments.map((attachment) => (
              <a 
                key={attachment.id}
                href={attachment.file}
                download
                className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <FileIcon size={18} className="text-blue-500 mr-2" />
                <span className="font-hse-sans">
                  {getFileNameFromUrl(attachment.file)}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const getFileNameFromUrl = (url: string): string => {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch (e) {
    return 'Файл';
  }
};

export default TaskContent;