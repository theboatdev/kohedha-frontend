"use client"

import { Tag, Copy } from "lucide-react"
import { C } from "@/lib/brand-theme"

export function CouponCard({ coupon }: { coupon: any }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{ background: C.cream, border: "2px dashed rgba(245,230,66,0.35)", borderRadius: "16px", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", background: C.bg2, borderRadius: "0 50% 50% 0", marginLeft: "-8px" }} />
      <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", background: C.bg2, borderRadius: "50% 0 0 50%", marginRight: "-8px" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tag size={20} style={{ color: C.accent }} />
          <span style={{ fontSize: "26px", fontWeight: 700, color: C.text }}>{coupon.discount}</span>
        </div>
        {coupon.code && (
          <button
            onClick={() => copyToClipboard(coupon.code)}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: C.dark, color: "white", border: "none", borderRadius: "40px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          >
            <Copy size={13} />
            {coupon.code}
          </button>
        )}
      </div>

      <div style={{ fontSize: "13px", color: C.muted, display: "flex", flexDirection: "column", gap: "4px" }}>
        {coupon.minimumSpend && <div>Minimum spend: LKR {coupon.minimumSpend}</div>}
        {coupon.maxDiscount && <div>Maximum discount: LKR {coupon.maxDiscount}</div>}
        {coupon.usageLimit && <div>Usage limit: {coupon.usageLimit} times</div>}
      </div>
    </div>
  )
}
