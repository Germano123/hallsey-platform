import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Folder,
  Users,
  Calendar,
  CheckCircle,
  Building,
  MessageSquareWarning,
} from "lucide-react";

const stats = [
  {
    title: "Visualizações de Cidades",
    value: "240",
    description: "+30% este mês",
    icon: Building,
    color: "text-emerald-600",
  },
  {
    title: "Eventos Programados",
    value: "8",
    description: "Próximos 30 dias",
    icon: Calendar,
    color: "text-amber-600",
  },
  {
    title: "Denúncias Silvestres",
    value: "37",
    description: "+5 este mês",
    icon: MessageSquareWarning,
    color: "text-blue-600",
  },
  {
    title: "Usuários Ativos",
    value: "156",
    description: "+23 esta semana",
    icon: CheckCircle,
    color: "text-green-600",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
