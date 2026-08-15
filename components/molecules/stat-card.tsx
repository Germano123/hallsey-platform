import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subText: string;
  subTextColor?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  borderTopColorClass?: string;
}

export function StatCard({
  title,
  value,
  subText,
  subTextColor = "text-[#34d399]",
  icon: IconComponent,
  iconColorClass = "text-[#f97316]",
  borderTopColorClass = "border-t-[#f97316]"
}: StatCardProps) {
  return (
    <Card className={`bg-[#1c1c22] border border-white/5 border-t-4 ${borderTopColorClass} p-5 rounded-2xl shadow-xl flex items-center justify-between`}>
      <div className="space-y-1.5">
        <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">{title}</span>
        <div className="text-2xl font-black text-[#f4ebd0]">{value}</div>
        <p className={`text-[10px] font-medium ${subTextColor}`}>
          {subText}
        </p>
      </div>
      <IconComponent className={`w-8 h-8 ${iconColorClass} opacity-80`} />
    </Card>
  );
}
