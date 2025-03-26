
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';

interface CalendarIntegrationProps {
  control: Control<any>;
  dueDate?: Date;
  title: string;
  description: string;
}

export const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ 
  control, 
  dueDate,
  title,
  description 
}) => {
  // Generate calendar links
  const generateGoogleCalendarLink = () => {
    if (!dueDate) return '';
    
    const encodedTitle = encodeURIComponent(title || 'Task');
    const encodedDescription = encodeURIComponent(description || '');
    const startDate = format(dueDate, "yyyyMMdd");
    const endDate = format(dueDate, "yyyyMMdd");
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&details=${encodedDescription}&dates=${startDate}/${endDate}`;
  };
  
  const generateOutlookCalendarLink = () => {
    if (!dueDate) return '';
    
    const encodedTitle = encodeURIComponent(title || 'Task');
    const encodedDescription = encodeURIComponent(description || '');
    const startDate = format(dueDate, "yyyy-MM-dd");
    
    return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodedTitle}&body=${encodedDescription}&startdt=${startDate}&enddt=${startDate}`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="calendarEventUrl">Calendar Link (Optional)</Label>
      <Controller
        name="calendarEventUrl"
        control={control}
        render={({ field }) => (
          <div>
            <Input 
              id="calendarEventUrl" 
              placeholder="Paste your calendar event URL" 
              className="bg-black/30 border-white/10 mb-2"
              {...field}
            />
            <div className="flex gap-4 text-xs mt-2">
              <a 
                href={generateGoogleCalendarLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png" 
                  alt="Google Calendar" 
                  className="h-4 w-4" 
                />
                Google Calendar
              </a>
              <a 
                href={generateOutlookCalendarLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/1101px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png" 
                  alt="Outlook" 
                  className="h-4 w-4" 
                />
                Outlook
              </a>
            </div>
          </div>
        )}
      />
    </div>
  );
};
