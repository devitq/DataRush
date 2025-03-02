import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TaskDescriptionFieldProps {
  description: string;
  onChange: (value: string) => void;
}

const TaskDescriptionField: React.FC<TaskDescriptionFieldProps> = ({ description, onChange }) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="description" className="text-right pt-2">
        Описание
      </Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => onChange(e.target.value)}
        className="col-span-3 min-h-[100px]"
        placeholder="Введите описание задачи"
      />
    </div>
  );
};

export default TaskDescriptionField;