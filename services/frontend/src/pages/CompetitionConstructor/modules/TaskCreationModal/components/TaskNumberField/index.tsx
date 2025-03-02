import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaskNumberFieldProps {
  number: string;
  onChange: (value: string) => void;
}

const TaskNumberField: React.FC<TaskNumberFieldProps> = ({ number, onChange }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="task-number" className="text-right">
        Номер задачи
      </Label>
      <Input
        id="task-number"
        value={number}
        onChange={(e) => onChange(e.target.value)}
        className="col-span-3"
      />
    </div>
  );
};

export default TaskNumberField;