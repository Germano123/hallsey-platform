import { SidebarInset } from "@/components/ui/sidebar";

export default function RelatoriosPage() {
    return (
      <SidebarInset className="bg-transparent border-none">
        <div className="p-6 md:p-8 font-cozy">
          <h2 className="text-xl font-bold text-[#f4ebd0]">Relatórios de Faturamento</h2>
          <p className="text-xs text-[#94a3b8] mt-1">Exportação de logs de transações e apoiadores do financiamento.</p>
          <div className="mt-6 p-12 border border-white/5 border-dashed rounded-2xl text-center text-xs text-[#94a3b8]">
            Área de exportação de dados em desenvolvimento.
          </div>
        </div>
      </SidebarInset>
    );
}
