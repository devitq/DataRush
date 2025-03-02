import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TaskRequirementsFieldProps {
  requirements: string;
  onChange: (value: string) => void;
}

const TaskRequirementsField: React.FC<TaskRequirementsFieldProps> = ({ requirements, onChange }) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="requirements" className="text-right pt-2">
        Требования
      </Label>
      <Textarea
        id="requirements"
        value={requirements}
        onChange={(e) => onChange(e.target.value)}
        className="col-span-3"
        placeholder="Введите требования к решению (необязательно)"
      />
    </div>
  );
};

export default TaskRequirementsField;