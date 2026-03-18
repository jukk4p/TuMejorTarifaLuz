"use client";

export default function LogsPage() {
    const logs = [
        { time: "2026-03-06 04:30:12", event: "Actualización de Tarifas", status: "success", user: "IA-SYSTEM" },
        { time: "2026-03-06 03:15:45", event: "Importación de CSV", status: "warning", user: "Admin" },
        { time: "2026-03-06 02:22:11", event: "Sincronización API OMIE", status: "success", user: "SYSTEM" },
        { time: "2026-03-05 23:59:00", event: "Backup de Base de Datos", status: "success", user: "SYSTEM" },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-800 dark:text-white uppercase tracking-tight">Logs del Sistema</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Actividad técnica del motor de comparación</p>
            </div>

            <div className="premium-card p-8">
                <div className="space-y-4">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-border">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-[11px] text-slate-400">{log.time}</span>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold dark:text-white">{log.event}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Usuario: {log.user}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${log.status === 'success' ? 'bg-accent-bg text-accent' : 'bg-warning/10 text-warning'
                                }`}>
                                {log.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
