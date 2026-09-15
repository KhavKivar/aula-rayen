import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  previewDateFormatter,
  toLocalIsoDate,
  todayReference,
} from "@/features/admin-reservations/components/schedule-model";

export function DatePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = new Date(`${value}T00:00:00`);
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-xl bg-card font-normal"
              aria-label={`${label}: ${previewDateFormatter.format(selected)}`}
            />
          }
        >
          <CalendarIcon className="text-muted-foreground" />
          {previewDateFormatter.format(selected)}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            key={value}
            mode="single"
            locale={es}
            selected={selected}
            onSelect={(date) => {
              if (date) onChange(toLocalIsoDate(date));
            }}
          />
          <div className="border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => onChange(todayReference)}
            >
              Volver a hoy
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
