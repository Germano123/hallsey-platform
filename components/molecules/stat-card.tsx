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
    <Card className={`bg-[#18181b] border border-zinc-800 border-t-4 ${borderTopColorClass} p-5 rounded-2xl shadow-xl flex items-center justify-between`}>
      <div className="space-y-1.5">
        <span className="text-xs text-zinc-300 uppercase font-extrabold tracking-wider">{title}</span>
        <div className="text-2xl font-black text-white">{value}</div>
        <p className={`text-xs font-bold ${subTextColor}`}>
          {subText}
        </p>
      </div>
      <IconComponent className={`w-8 h-8 ${iconColorClass} opacity-90`} />
    </Card>
  );
}
