import { SidebarInset } from "@/components/ui/sidebar";

export default function ConfiguracoesPage() {
    return (
      <SidebarInset className="bg-transparent border-none">
        <div className="p-6 md:p-8 font-cozy">
          <h2 className="text-xl font-bold text-[#f4ebd0]">Configurações da Plataforma</h2>
          <p className="text-xs text-[#94a3b8] mt-1">Definições globais de chaves de API, NFC e VTT.</p>
          <div className="mt-6 p-12 border border-white/5 border-dashed rounded-2xl text-center text-xs text-[#94a3b8]">
            Definições do sistema indisponíveis.
          </div>
        </div>
      </SidebarInset>
    );
}
