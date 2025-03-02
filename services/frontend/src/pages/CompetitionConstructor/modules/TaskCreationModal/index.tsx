// import React, { useState } from 'react';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogFooter 
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Task } from "@/shared/types";
// import TaskNumberField from './components/TaskNumberField';
// import TaskDescriptionField from './components/TaskDescriptionField';
// import TaskRequirementsField from './components/TaskRequirementsField';
// import TaskSolutionTypeSelector from './components/TaskSolutionTypeSelector';
// import TaskFileAttachments from './components/TaskFileAttachments';

// interface TaskCreationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onCreateTask: (task: Partial<Task>) => void;
//   taskCount: number;
// }

// const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
//   isOpen,
//   onClose,
//   onCreateTask,
//   taskCount
// }) => {
//   const [number, setNumber] = useState(`${taskCount + 1}`);
//   const [description, setDescription] = useState('');
//   const [requirements, setRequirements] = useState('');
//   const [solutionType, setSolutionType] = useState<'input' | 'file' | 'code'>('input');
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
//   const handleSubmit = () => {
//     const newTask: Partial<Task> = {
//       number,
//       description,
//       requirements: requirements || undefined,
//       solutionType,
//       attachments: attachedFiles.map(file => file.name)
//     };
    
//     onCreateTask(newTask);
    
//     setNumber(`${taskCount + 1}`);
//     setDescription('');
//     setRequirements('');
//     setSolutionType('input');
//     setAttachedFiles([]);
//   };
  
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] font-hse-sans">
//         <DialogHeader>
//           <DialogTitle className="text-xl">Создание новой задачи</DialogTitle>
//         </DialogHeader>
        
//         <div className="grid gap-4 py-4">
//           <TaskNumberField 
//             number={number} 
//             onChange={setNumber} 
//           />
          
//           <TaskDescriptionField 
//             description={description} 
//             onChange={setDescription} 
//           />
          
//           <TaskRequirementsField 
//             requirements={requirements} 
//             onChange={setRequirements} 
//           />
          
//           <TaskSolutionTypeSelector 
//             solutionType={solutionType} 
//             onChange={setSolutionType} 
//           />
          
//           <TaskFileAttachments 
//             files={attachedFiles} 
//             onChange={setAttachedFiles} 
//           />
//         </div>
        
//         <DialogFooter>
//           <Button type="button" variant="outline" onClick={onClose}>
//             Отмена
//           </Button>
//           <Button type="button" onClick={handleSubmit}>
//             Создать задачу
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TaskCreationModal;