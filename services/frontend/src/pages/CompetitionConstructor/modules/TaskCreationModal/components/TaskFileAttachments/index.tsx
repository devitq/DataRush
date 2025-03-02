import React from 'react';
import { FileIcon, X, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TaskFileAttachmentsProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const TaskFileAttachments: React.FC<TaskFileAttachmentsProps> = ({ files, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };
  
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2">
        Файлы
      </Label>
      <div className="col-span-3">
        <div className="flex flex-col gap-2">
          {files.map((file, index) => (
            <FileListItem 
              key={index} 
              file={file} 
              onRemove={() => removeFile(index)} 
            />
          ))}
          
          <FileUploadButton onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
};

interface FileListItemProps {
  file: File;
  onRemove: () => void;
}

const FileListItem: React.FC<FileListItemProps> = ({ file, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center">
        <FileIcon size={16} className="mr-2 text-gray-500" />
        <span className="text-sm">{file.name}</span>
        <span className="text-xs text-gray-500 ml-2">
          ({Math.round(file.size / 1024)} KB)
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRemove}
      >
        <X size={16} />
      </Button>
    </div>
  );
};

interface FileUploadButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onChange }) => {
  return (
    <label className="cursor-pointer">
      <div className="flex items-center gap-2 p-2 border border-dashed rounded-md hover:bg-gray-50 transition-colors">
        <Upload size={16} className="text-gray-500" />
        <span className="text-sm text-gray-700">Добавить файлы</span>
      </div>
      <input 
        type="file" 
        className="hidden" 
        onChange={onChange}
        multiple
      />
    </label>
  );
};

export default TaskFileAttachments;