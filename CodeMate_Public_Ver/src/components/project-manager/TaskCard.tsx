
import React from 'react';
import { Task, TaskPriority } from '@/types/project';
import { Card } from '@/components/ui/card';
import { ArrowRight, Calendar, GripVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  medium: 'bg-green-500/20 text-green-300 border-green-500/30',
  high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  urgent: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const priorityIndicators: Record<TaskPriority, string> = {
  low: '■',
  medium: '■ ■',
  high: '■ ■ ■',
  urgent: '■ ■ ■ ■',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDelete }) => {
  return (
    <Card 
      className="bg-black/30 border border-white/10 rounded-lg p-3 cursor-grab hover:border-white/30 hover:bg-black/40 transition-all shadow-sm active:cursor-grabbing"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="opacity-30 mr-2 flex-shrink-0">
          <GripVertical className="h-4 w-4" />
        </div>
        <h3 className="font-medium text-sm break-words flex-1">{task.title}</h3>
        <div className="flex items-center gap-1">
          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {onDelete && (
            <button 
              className="ml-1 p-1 rounded-full hover:bg-red-500/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e);
              }}
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        <span className="text-xs text-gray-400">
          {priorityIndicators[task.priority]}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
        
        {task.tags.length > 2 && (
          <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
            +{task.tags.length - 2}
          </span>
        )}
      </div>
      
      {/* Due date display */}
      {task.dueDate && (
        <div className="flex items-center gap-2 mb-2 text-xs">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
          {task.calendarEventUrl && (
            <a 
              href={task.calendarEventUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 ml-auto"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
            >
              View
            </a>
          )}
        </div>
      )}
      
      {task.assignee && (
        <div className="flex items-center gap-2 mt-2 border-t border-white/5 pt-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-codemate-purple to-codemate-blue flex items-center justify-center text-xs">
            {task.assignee.name.charAt(0)}
          </div>
          <span className="text-xs text-gray-400 truncate">{task.assignee.name}</span>
        </div>
      )}
    </Card>
  );
};

export default TaskCard;
