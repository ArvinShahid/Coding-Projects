
import React from 'react';
import { Button } from "@/components/ui/button";

interface TaskModalFooterProps {
  onClose: () => void;
  isEditing: boolean;
}

export const TaskModalFooter: React.FC<TaskModalFooterProps> = ({ 
  onClose,
  isEditing
}) => {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? 'Update Task' : 'Create Task'}
      </Button>
    </div>
  );
};
