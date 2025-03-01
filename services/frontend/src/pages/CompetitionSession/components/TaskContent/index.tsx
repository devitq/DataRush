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
  const markdownContent = `
## Задача на числовую последовательность

Рассмотрим последовательность чисел: 
\`2, 3, 5, 9, 17, 33, 65, 129, ...\`

Каждый член этой последовательности, **начиная с третьего**, равен сумме двух предыдущих членов:
- $a_1 = 2$
- $a_2 = 3$
- $a_n = a_{n-1} + a_{n-2}$ для всех $n ≥ 3$

### Задание:
Найдите сумму первых 15 членов этой последовательности.

*Примечание:* Для решения задачи вам может быть полезно записать несколько первых членов последовательности:
1. $a_1 = 2$
2. $a_2 = 3$
3. $a_3 = 3 + 2 = 5$
4. $a_4 = 5 + 3 = 8$
5. $a_5 = 8 + 5 = 13$

**В ответе укажите целое число.**
  `;

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
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default TaskContent;