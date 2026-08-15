import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { House } from "lucide-react";

export default function DashboardPage() {
    return (
        <SidebarInset>
            <div className="mt-8 px-12
            grid grid-cols-4
            items-center justify-center gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card className="p-4
                    flex items-center justify-between" key={index}>
                        <div>
                            <CardTitle>Dashboard Stat</CardTitle>
                            <CardDescription>Dashboard description stat</CardDescription>
                        </div>
                        <House className="w-6 h-6" />
                    </Card>
                ))}
            </div>
        </SidebarInset>
    )
}
