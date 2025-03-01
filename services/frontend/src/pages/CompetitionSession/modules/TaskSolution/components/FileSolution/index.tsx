import React from 'react';
import { FileIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileSolutionProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileSolution: React.FC<FileSolutionProps> = ({ 
  selectedFile, 
  setSelectedFile, 
  fileInputRef 
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-50');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pptx,.docx,.pdf,.xlsx,.txt"
      />
      
      {selectedFile ? (
        <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[180px]">
          <div className="flex flex-col items-center">
            <FileIcon size={28} className="text-black mb-2" />
            <span className="text-sm text-gray-700 font-medium mb-1 font-hse-sans">{selectedFile.name}</span>
            <span className="text-xs text-gray-500 font-hse-sans">{(selectedFile.size / 1024).toFixed(1)} KB</span>
            <Button 
              variant="ghost" 
              className="text-blue-500 text-sm mt-2 p-0 h-auto hover:bg-transparent hover:text-blue-600 font-hse-sans"
              onClick={() => setSelectedFile(null)}
            >
              Выбрать другой файл
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[180px] cursor-pointer transition-colors"
          onClick={handleFileUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileIcon size={28} className="text-black mb-3" />
          <span 
            className="bg-[var(--color-yellow-standard)] text-black font-medium rounded-full px-4 py-1.5 text-sm mb-2 font-hse-sans inline-block"
          >
            Загрузить файл
          </span>
          <p className="text-xs text-gray-500 text-center font-hse-sans">
            Доступные форматы: jpg, jpeg, png
          </p>
        </div>
      )}
    </>
  );
};

export default FileSolution;