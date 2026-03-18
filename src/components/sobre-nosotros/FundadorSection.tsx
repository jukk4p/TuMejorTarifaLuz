import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FundadorSection() {
  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start py-20 px-8 md:px-12 bg-surface rounded-[3rem] border border-border mb-24 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

      <div className="lg:col-span-12 space-y-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-xs">El Fundador</h2>
            <p className="text-4xl md:text-5xl font-900 text-text-primary tracking-tight">
              Iván González
            </p>
            <p className="text-lg text-slate-500 font-700">Desarrollador y fundador de TuMejorTarifaLuz</p>
          </div>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none space-y-8">
            <blockquote className="text-xl md:text-2xl text-text-primary leading-relaxed italic border-l-8 border-primary pl-8 py-6 bg-primary/5 rounded-r-3xl my-10 font-medium">
              "Durante más de dos años estuve analizando y optimizando las facturas de luz de mis familiares y amigos. Lo que empezó como un favor puntual se convirtió en una rutina: alguien me mandaba su factura, yo la cruzaba con el mercado, y casi siempre encontraba un ahorro significativo que nadie les había contado."
            </blockquote>

            <div className="grid md:grid-cols-2 gap-12 pt-6">
              <div className="space-y-6">
                <p className="text-text-secondary leading-relaxed text-lg text-pretty">
                  Me di cuenta de que el problema no era la gente, era la <strong>opacidad del sistema</strong>. Los comparadores existentes o te pedían el teléfono para que te llamara un comercial, o solo mostraban las compañías con las que tenían acuerdo. Nadie te daba una respuesta limpia y sin intereses.
                </p>

                <p className="text-text-secondary leading-relaxed text-lg text-pretty">
                  Cuando me di de alta como <strong>autónomo en 2025</strong>, tenía claro lo que quería construir: el comparador que ya llevaba meses desarrollando de forma personal, pero ahora terminado y abierto a cualquiera.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-text-secondary leading-relaxed text-lg text-pretty">
                  TuMejorTarifaLuz nació en 2025 como proyecto personal de Iván González, desarrollador que durante más de dos años analizó facturas de luz de forma manual para familiares y amigos.
                </p>
                <p className="text-text-secondary leading-relaxed text-lg text-pretty">
                  Hoy, el comparador analiza más de 150 tarifas activas de más de 20 compañías, actualizado diariamente con datos de OMIE y las comercializadoras. Todo esto sin pedir el teléfono, sin vender datos y sin cobrar un euro al usuario.
                </p>
              </div>
            </div>
            
            <div className="pt-16 border-t border-border">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-900 text-text-primary">Transparencia Real</h3>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    Nuestro comparador no tiene acuerdos comerciales con ninguna comercializadora. Si decides cambiarte, lo haces por tu cuenta a través de los enlaces oficiales que te facilitamos. Sin trampa ni cartón.
                  </p>
                </div>
                <div className="bg-slate-900 rounded-[2rem] p-8 flex items-center justify-around text-center">
                  <div className="space-y-1">
                    <p className="text-white font-900 text-3xl">2025</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fundación</p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div className="space-y-1">
                    <p className="text-primary font-900 text-3xl">100%</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Independiente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
