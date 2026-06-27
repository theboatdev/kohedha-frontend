import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type FormSectionProps = {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
};

export function FormSection({ title, icon: Icon, children }: FormSectionProps) {
  return (
    <div>
      <h3
        className="font-poppins font-bold text-2xl tracking-tight mb-4 pb-2 flex items-center"
        style={{
          color: "#0D0D0D",
          borderBottom: "1px solid rgba(13,13,13,0.08)",
        }}
      >
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {title}
      </h3>
      {children}
    </div>
  );
}
