
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface TagsFieldProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export const TagsField: React.FC<TagsFieldProps> = ({ id, value, onChange }) => {
  const [tagInput, setTagInput] = useState('');
  
  const handleAddTag = () => {
    if (tagInput.trim() && !value.includes(tagInput.trim())) {
      onChange([...value, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag and press Enter"
          className="bg-black/30 border-white/10"
        />
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={handleAddTag}
          className="border-white/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map(tag => (
            <div 
              key={tag} 
              className="flex items-center gap-1 bg-white/10 text-white px-2 py-1 rounded-full text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
