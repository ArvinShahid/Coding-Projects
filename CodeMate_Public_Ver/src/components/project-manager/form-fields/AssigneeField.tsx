
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamMember } from '@/types/project';

interface AssigneeFieldProps {
  id: string;
  value?: string;
  onChange: (value?: string) => void;
  members: TeamMember[];
}

export const AssigneeField: React.FC<AssigneeFieldProps> = ({ 
  id, 
  value, 
  onChange, 
  members 
}) => {
  return (
    <Select
      value={value || "unassigned"}
      onValueChange={(val) => onChange(val === "unassigned" ? undefined : val)}
    >
      <SelectTrigger id={id} className="w-full bg-black/30 border-white/10">
        <SelectValue placeholder="Unassigned" />
      </SelectTrigger>
      <SelectContent className="glass-morphism border-white/10">
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {members.map(member => (
          <SelectItem key={member.id} value={member.id}>
            {member.name} ({member.role})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
