import React from 'react';
import { FileIcon, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileSolutionProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  fileUrl?: string | null; 
}

const FileSolution: React.FC<FileSolutionProps> = ({ 
  selectedFile, 
  setSelectedFile, 
  fileInputRef,
  fileUrl = null
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

  const fileName = selectedFile ? selectedFile.name : fileUrl ? fileUrl.split('/').pop() || 'file' : '';

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pptx,.docx,.pdf,.xlsx,.txt"
      />
      
      {(selectedFile || fileUrl) ? (
        <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[180px]">
          <div className="flex flex-col items-center">
            <FileIcon size={28} className="text-black mb-2" />
            <span className="text-sm text-gray-700 font-medium mb-1 font-hse-sans">{fileName}</span>
            
            <div className="flex items-center mt-2">
              {fileUrl && (
                <a 
                  href={fileUrl}
                  download
                  className="flex items-center text-blue-500 text-sm mr-3 hover:text-blue-600"
                >
                  <Download size={16} className="mr-1" />
                  Скачать
                </a>
              )}
              <Button 
                variant="ghost" 
                className="text-blue-500 text-sm p-0 h-auto hover:bg-transparent hover:text-blue-600 font-hse-sans"
                onClick={() => setSelectedFile(null)}
              >
                {fileUrl ? "Выбрать другой файл" : "Очистить"}
              </Button>
            </div>
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
            Доступные форматы: jpg, jpeg, png, pptx, docx, pdf, xlsx, txt
          </p>
        </div>
      )}
    </>
  );
};

export default FileSolution;