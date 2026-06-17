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
  iconBgColor = "rgba(196,114,74,0.12)",
  iconColor = "#C4724A",
}: StatsCardProps) {
  return (
    <div
      className="font-dm-sans"
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(42,38,32,0.08)",
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
        className="font-dm-serif"
        style={{
          fontSize: "36px",
          color: "#2A2620",
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
          color: "#2A2620",
          marginBottom: "2px",
        }}
      >
        {label}
      </p>
      {sublabel && (
        <p style={{ fontSize: "12px", color: "#7A7368" }}>{sublabel}</p>
      )}
    </div>
  );
}
