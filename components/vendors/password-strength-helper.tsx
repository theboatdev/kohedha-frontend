"use client";

import { Check, Circle } from "lucide-react";
import { getPasswordRuleStatus } from "@/lib/password-validation";

interface PasswordStrengthHelperProps {
  password: string;
  colors?: {
    text: string;
    muted: string;
    accent: string;
  };
}

const DEFAULT_COLORS = {
  text: "#0D0D0D",
  muted: "rgba(13,13,13,0.48)",
  accent: "#F5E642",
};

export function PasswordStrengthHelper({
  password,
  colors = DEFAULT_COLORS,
}: PasswordStrengthHelperProps) {
  const rules = getPasswordRuleStatus(password);
  const metCount = rules.filter((rule) => rule.met).length;
  const allMet = metCount === rules.length;

  return (
    <div aria-live="polite" style={{ marginTop: "8px" }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: colors.muted,
          marginBottom: "6px",
        }}
      >
        Password must include:
      </p>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {rules.map((rule) => (
          <li
            key={rule.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              transition: "color 0.15s ease",
            }}
          >
            {rule.met ? (
              <Check
                style={{
                  width: 14,
                  height: 14,
                  flexShrink: 0,
                  color: colors.accent,
                }}
                aria-hidden
              />
            ) : (
              <Circle
                style={{
                  width: 14,
                  height: 14,
                  flexShrink: 0,
                  color: colors.muted,
                  opacity: 0.5,
                }}
                aria-hidden
              />
            )}
            <span style={{ color: rule.met ? colors.text : colors.muted }}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
      {password.length > 0 && (
        <p
          style={{
            fontSize: "11px",
            marginTop: "8px",
            color: allMet ? colors.accent : colors.muted,
            fontWeight: allMet ? 600 : 400,
          }}
        >
          {allMet
            ? "Password meets all requirements"
            : `${metCount} of ${rules.length} requirements met`}
        </p>
      )}
    </div>
  );
}
