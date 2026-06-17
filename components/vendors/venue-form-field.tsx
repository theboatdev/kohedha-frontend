import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VenueFormFieldProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "select";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  selectOptions?: { value: string; label: string }[];
};

export function VenueFormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  helperText,
  selectOptions,
}: VenueFormFieldProps) {
  const renderInput = () => {
    if (type === "textarea") {
      return (
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="font-poppins border-gray-200 focus:border-gray-900 min-h-[100px]"
          disabled={disabled}
        />
      );
    }

    if (type === "select" && selectOptions) {
      return (
        <Select
          value={value}
          onValueChange={(val) => onChange?.(val)}
          disabled={disabled}
        >
          <SelectTrigger className="font-poppins h-12 border-gray-200 focus:border-gray-900">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`font-poppins h-12 border-gray-200 focus:border-gray-900 ${
          disabled ? "bg-gray-50" : ""
        }`}
        disabled={disabled}
        required={required}
      />
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium font-poppins text-gray-900">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {renderInput()}
      {helperText && (
        <p className="text-xs text-gray-500 font-poppins">{helperText}</p>
      )}
    </div>
  );
}
