import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: LucideIcon;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  rows = 4,
  maxLength,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={name}
        className="block text-sm font-medium font-poppins text-gray-900"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
        )}

        {type === "textarea" ? (
          <Textarea
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              "font-poppins resize-none",
              error && "border-red-500 focus-visible:ring-red-500",
            )}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={cn(
              "font-poppins",
              Icon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
            )}
          />
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-poppins mt-1">{error}</p>
      )}

      {maxLength && !error && (
        <p className="text-xs text-gray-400 font-poppins text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
