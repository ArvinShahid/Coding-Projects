
import React from 'react';
import { Label } from "@/components/ui/label";
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  id: string;
  label: string;
  control: Control<any>;
  name: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ 
  id, 
  label, 
  control,
  name
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-black/30 border-white/10",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Set {label.toLowerCase()}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
};
