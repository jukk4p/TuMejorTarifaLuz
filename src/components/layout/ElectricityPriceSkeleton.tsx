export default function ElectricityPriceSkeleton() {
    return (
        <div className="relative premium-card p-6 md:p-10 overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative z-10 w-full">
                <div className="text-center md:text-left space-y-4 max-w-md w-full">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto md:mx-0"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mx-auto md:mx-0"></div>
                        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto md:mx-0"></div>
                    </div>
                    <div className="flex justify-center md:justify-start gap-2">
                        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-24"></div>
                        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-24"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto">
                    <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl w-28 md:w-32"></div>
                    <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl w-28 md:w-32"></div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-40"></div>
            </div>
        </div>
    );
}
