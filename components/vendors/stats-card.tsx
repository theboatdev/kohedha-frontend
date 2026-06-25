import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
  sublabel?: string;
  iconBgColor?: string;
  iconColor?: string;
};

export function StatsCard({
  icon: Icon,
  value,
  label,
  sublabel,
  iconBgColor = "rgba(245,230,66,0.12)",
  iconColor = "#F5E642",
}: StatsCardProps) {
  return (
    <div
      className="font-dm-sans"
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(13,13,13,0.08)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: iconBgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Icon style={{ width: 18, height: 18, color: iconColor }} />
      </div>
      <p
        className="font-poppins"
        style={{
          fontSize: "36px",
          color: "#0D0D0D",
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "#0D0D0D",
          marginBottom: "2px",
        }}
      >
        {label}
      </p>
      {sublabel && (
        <p style={{ fontSize: "12px", color: "rgba(13,13,13,0.48)" }}>{sublabel}</p>
      )}
    </div>
  );
}
