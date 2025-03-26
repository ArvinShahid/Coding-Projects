
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Task, TaskStatus } from '@/types/project';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { ScrollArea } from '@/components/ui/scroll-area';

const KanbanBoard: React.FC = () => {
  const { project, moveTask, addTask, deleteTask } = useProject();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Define columns for the board
  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
  ];
  
  // Group tasks by status
  const tasksByStatus = columns.reduce<Record<TaskStatus, Task[]>>((acc, column) => {
    acc[column.id] = project?.tasks.filter(task => task.status === column.id) || [];
    return acc;
  }, {} as Record<TaskStatus, Task[]>);
  
  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Move the task to new status
    const newStatus = destination.droppableId as TaskStatus;
    moveTask(draggableId, newStatus);
  };
  
  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };
  
  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };
  
  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    setIsTaskModalOpen(false);
  };

  // Show empty state if no tasks
  const hasNoTasks = project?.tasks.length === 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <Button onClick={handleAddTask} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      {hasNoTasks ? (
        <div className="bg-black/20 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No Tasks Yet</h3>
          <p className="text-gray-400 mb-6">
            Use the AI task generator in the Overview tab to create tasks based on your project description, 
            or add tasks manually with the "Add Task" button.
          </p>
          <Button variant="outline" onClick={handleAddTask} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add First Task
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 300px)" }}>
            {columns.map(column => (
              <div key={column.id} className="flex-shrink-0 w-[300px] kanban-column">
                <Card className="h-full glass-morphism border-white/10">
                  <CardHeader className="px-4 py-3 bg-black/40 rounded-t-lg">
                    <CardTitle className="text-sm flex justify-between items-center">
                      <span>{column.title}</span>
                      <span className="text-xs text-gray-400 bg-black/40 px-2 py-1 rounded-full">
                        {tasksByStatus[column.id].length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <ScrollArea className="h-[70vh] pr-2">
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="min-h-[70vh] space-y-3"
                          >
                            {tasksByStatus[column.id].map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      position: snapshot.isDragging ? 'fixed' : 'relative',
                                      zIndex: 9999,
                                      cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                      transform: provided.draggableProps.style?.transform,
                                      boxShadow: snapshot.isDragging
                                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                                        : 'none',
                                      opacity: snapshot.isDragging ? 0.9 : 1,
                                      width: snapshot.isDragging ? 
                                        (provided.draggableProps.style?.width || 'auto') : 'auto',
                                      height: snapshot.isDragging ? 
                                        (provided.draggableProps.style?.height || 'auto') : 'auto',
                                    }}
                                    className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                  >
                                    <TaskCard 
                                      task={task} 
                                      onClick={() => handleEditTask(task)}
                                      onDelete={(e) => handleDeleteTask(task.id)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </ScrollArea>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />
    </div>
  );
};

export default KanbanBoard;
