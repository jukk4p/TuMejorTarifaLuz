const fs = require('fs');
const path = require('path');

// Mapeos de utilidades antiguas (Tailwind pre-CSS-first) a los nuevos tokens semánticos
const replaceMap = [
    { regex: /bg-slate-50\/50 dark:bg-slate-900\/50/g, replacement: 'bg-surface/50' },
    { regex: /bg-slate-50\/50 dark:bg-slate-800\/40/g, replacement: 'bg-surface-2/40' },
    { regex: /bg-slate-50\/30 dark:bg-slate-900\/30/g, replacement: 'bg-surface/30' },
    { regex: /bg-white dark:bg-slate-800\/40/g, replacement: 'bg-surface-2/40' },
    { regex: /bg-white dark:bg-slate-800/g, replacement: 'bg-surface-2' },
    { regex: /bg-slate-50 dark:bg-slate-900/g, replacement: 'bg-surface' },
    { regex: /border-slate-200 dark:border-slate-700/g, replacement: 'border-border' },
    { regex: /border-slate-200 dark:border-slate-800/g, replacement: 'border-border' },
    { regex: /text-slate-800 dark:text-slate-200/g, replacement: 'text-text-heading' },
    { regex: /text-slate-600 dark:text-slate-300/g, replacement: 'text-text-body' },
    { regex: /text-slate-600 dark:text-slate-400/g, replacement: 'text-text-muted' },
    { regex: /text-emerald-600 dark:text-emerald-400/g, replacement: 'text-savings-text' },
    { regex: /bg-emerald-50 dark:bg-emerald-900\/10/g, replacement: 'bg-savings-bg' }
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const absolutePath = path.join(directory, file);
        const stat = fs.statSync(absolutePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                processDirectory(absolutePath);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(absolutePath, 'utf-8');
            let hasChanges = false;

            replaceMap.forEach(({ regex, replacement }) => {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                fs.writeFileSync(absolutePath, content, 'utf-8');
                console.log('✅ Updated:', absolutePath);
            }
        }
    });
}

const targetDir = path.join(__dirname, 'src');
console.log('🚀 Iniciando refactor láser de CSS-First...');
processDirectory(targetDir);
console.log('✨ Refactorizado completo. Corré "npm run build" para verificar.');
