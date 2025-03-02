import React from 'react';
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TaskSolutionTypeSelectorProps {
  solutionType: 'input' | 'file' | 'code';
  onChange: (value: 'input' | 'file' | 'code') => void;
}

const TaskSolutionTypeSelector: React.FC<TaskSolutionTypeSelectorProps> = ({ solutionType, onChange }) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2">
        Тип решения
      </Label>
      <RadioGroup 
        className="col-span-3" 
        value={solutionType} 
        onValueChange={(value) => onChange(value as 'input' | 'file' | 'code')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="input" id="input" />
          <Label htmlFor="input">Ввод ответа</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="file" id="file" />
          <Label htmlFor="file">Загрузка файла</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="code" id="code" />
          <Label htmlFor="code">Программный код</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TaskSolutionTypeSelector;