
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task, TaskStatus, TaskPriority } from '@/types/project';
import { useProject } from '@/contexts/ProjectContext';
import { useForm } from 'react-hook-form';
import { TaskFormFields } from './form-fields/TaskFormFields';
import { DateSelector } from './form-fields/DateSelector';
import { CalendarIntegration } from './form-fields/CalendarIntegration';
import { TaskModalFooter } from './form-fields/TaskModalFooter';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
  task?: Task | null;
}

interface FormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  tags: string[];
  dueDate?: Date;
  calendarEventUrl?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmit,
  onDelete,
  task
}) => {
  const { project } = useProject();
  
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      assigneeId: task?.assignee?.id,
      tags: task?.tags || [],
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      calendarEventUrl: task?.calendarEventUrl || '',
    }
  });
  
  // Reset form when task changes
  React.useEffect(() => {
    if (isOpen) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'todo',
        priority: task?.priority || 'medium',
        assigneeId: task?.assignee?.id,
        tags: task?.tags || [],
        dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
        calendarEventUrl: task?.calendarEventUrl || '',
      });
    }
  }, [isOpen, task, reset]);
  
  const handleFormSubmit = (data: FormValues) => {
    const assignee = data.assigneeId 
      ? project?.members.find(m => m.id === data.assigneeId)
      : undefined;
    
    onSubmit({
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      priority: data.priority as TaskPriority,
      assignee,
      tags: data.tags,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      calendarEventUrl: data.calendarEventUrl || undefined,
    });
  };

  const title = watch('title');
  const description = watch('description');
  const dueDate = watch('dueDate');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-white/10 sm:max-w-md max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          {task && onDelete && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 rounded-full"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <TaskFormFields 
              control={control} 
              members={project?.members || []} 
            />
            
            <DateSelector 
              id="dueDate"
              label="Due Date"
              control={control}
              name="dueDate"
            />
            
            {dueDate && (
              <CalendarIntegration 
                control={control}
                dueDate={dueDate}
                title={title}
                description={description}
              />
            )}
            
            <TaskModalFooter 
              onClose={onClose} 
              isEditing={!!task} 
            />
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
