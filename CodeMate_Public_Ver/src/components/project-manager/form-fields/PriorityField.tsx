
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskPriority } from '@/types/project';

interface PriorityFieldProps {
  id: string;
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
}

export const PriorityField: React.FC<PriorityFieldProps> = ({ id, value, onChange }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange as (value: string) => void}
    >
      <SelectTrigger id={id} className="w-full bg-black/30 border-white/10">
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent className="glass-morphism border-white/10">
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="urgent">Urgent</SelectItem>
      </SelectContent>
    </Select>
  );
};
