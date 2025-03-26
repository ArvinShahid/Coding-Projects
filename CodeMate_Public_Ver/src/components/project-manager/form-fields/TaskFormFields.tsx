import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { TaskPriority, TaskStatus, TeamMember } from '@/types/project';
import { StatusField } from './StatusField';
import { PriorityField } from './PriorityField';
import { AssigneeField } from './AssigneeField';
import { TagsField } from './TagsField';

interface TaskFormFieldsProps {
  control: Control<any>;
  members: TeamMember[];
}

export const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ 
  control,
  members
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input 
              id="title" 
              placeholder="Task title" 
              className="bg-black/30 border-white/10"
              {...field}
            />
          )}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea 
              id="description" 
              placeholder="Describe the task..."
              className="bg-black/30 border-white/10 min-h-[100px]"
              {...field} 
            />
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <StatusField 
                id="status" 
                value={field.value as TaskStatus} 
                onChange={field.onChange as (value: TaskStatus) => void} 
              />
            )}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <PriorityField 
                id="priority" 
                value={field.value as TaskPriority} 
                onChange={field.onChange as (value: TaskPriority) => void} 
              />
            )}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <AssigneeField 
              id="assignee" 
              value={field.value} 
              onChange={field.onChange} 
              members={members}
            />
          )}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagsField 
              id="tags" 
              value={field.value} 
              onChange={field.onChange} 
            />
          )}
        />
      </div>
    </>
  );
};
