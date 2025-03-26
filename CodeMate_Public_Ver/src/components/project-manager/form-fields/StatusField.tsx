
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus } from '@/types/project';

interface StatusFieldProps {
  id: string;
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
}

export const StatusField: React.FC<StatusFieldProps> = ({ id, value, onChange }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange as (value: string) => void}
    >
      <SelectTrigger id={id} className="w-full bg-black/30 border-white/10">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent className="glass-morphism border-white/10">
        <SelectItem value="backlog">Backlog</SelectItem>
        <SelectItem value="todo">To Do</SelectItem>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="review">Review</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
};
