import { readFileSync, writeFileSync } from 'fs';

async function main() {
    // 1. Load APIFY_TOKEN from .env.local
    let token = process.env.APIFY_TOKEN;
    if (!token) {
        try {
            const envContent = readFileSync('.env.local', 'utf8');
            token = envContent.match(/APIFY_TOKEN=(.*)/)?.[1]?.trim();
        } catch (e) {
            console.error('❌ Error reading .env.local:', e.message);
        }
    }

    if (!token) {
        console.error('❌ Error: APIFY_TOKEN is not defined');
        process.exit(1);
    }

    const actorId = 'getwally.net~trustpilot-reviews-scraper';

    const companies = [
        { id: 'iberdrola', domain: 'iberdrola.es' },
        { id: 'endesa', domain: 'endesa.com' },
        { id: 'naturgy', domain: 'naturgy.es' },
        { id: 'repsol', domain: 'repsol.es' },
        { id: 'octopus', domain: 'octopusenergy.es' },
        { id: 'totalenergies', domain: 'totalenergies.es' },
        { id: 'niba', domain: 'niba.es' },
        { id: 'imagina', domain: 'imaginaenergia.com' },
        { id: 'visalia', domain: 'visalia.es' },
        { id: 'energianufri', domain: 'energianufri.com' },
        { id: 'energiavm', domain: 'energiavm.es' },
        { id: 'atulado', domain: 'atuladoenergia.com' },
        { id: 'esluz', domain: 'esluz.es' },
        { id: 'cor', domain: 'curenergia.es' }
    ];

    console.log(`🚀 Starting Apify runs in batches for ${companies.length} companies...`);

    const BATCH_SIZE = 4;
    const allResults = [];

    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
        const batch = companies.slice(i, i + BATCH_SIZE);
        console.log(`\n📦 Starting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(companies.length / BATCH_SIZE)}: ${batch.map(b => b.id).join(', ')}`);

        // Start batch runs
        const startPromises = batch.map(async (company) => {
            const startUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`;
            const payload = {
                startUrls: [{ url: `https://es.trustpilot.com/review/${company.domain}` }],
                maxReviews: 10
            };

            try {
                const response = await fetch(startUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const startData = await response.json();
                if (!startData.data) {
                    console.error(`❌ Error starting run for ${company.id}:`, startData);
                    return { company, success: false };
                }
                return {
                    company,
                    success: true,
                    runId: startData.data.id,
                    datasetId: startData.data.defaultDatasetId,
                    status: 'READY'
                };
            } catch (e) {
                console.error(`❌ Fetch error for ${company.id}:`, e.message);
                return { company, success: false };
            }
        });

        const activeRuns = (await Promise.all(startPromises)).filter(r => r.success);
        console.log(`📡 Started ${activeRuns.length} runs in this batch. Waiting for completion...`);

        // Poll batch runs until finished
        let allFinished = false;
        let attempts = 0;
        const maxAttempts = 30; // 5 minutes max

        while (!allFinished && attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            let completedCount = 0;
            for (const run of activeRuns) {
                if (run.status === 'SUCCEEDED' || run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
                    completedCount++;
                    continue;
                }

                const statusUrl = `https://api.apify.com/v2/actor-runs/${run.runId}?token=${token}`;
                try {
                    const statusRes = await fetch(statusUrl);
                    const statusData = await statusRes.json();
                    run.status = statusData.data.status;
                    if (run.status === 'SUCCEEDED' || run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
                        completedCount++;
                    }
                } catch (e) {
                    console.error(`⚠️ Error checking status for ${run.company.id}:`, e.message);
                }
            }

            console.log(`[Attempt ${attempts}] Progress: ${completedCount}/${activeRuns.length} finished.`);
            if (completedCount === activeRuns.length) {
                allFinished = true;
            }
        }

        allResults.push(...activeRuns);
    }

    // Fetch dataset items for all completed runs and group them
    const groupedReviews = {};
    
    console.log('\n📥 Fetching all reviews from datasets...');
    for (const run of allResults) {
        groupedReviews[run.company.id] = [];
        
        if (run.status !== 'SUCCEEDED' && run.status !== 'TIMED-OUT') {
            console.warn(`⚠️ Run for ${run.company.id} ended with status ${run.status}. Skipping.`);
            continue;
        }

        const itemsUrl = `https://api.apify.com/v2/datasets/${run.datasetId}/items?token=${token}`;
        try {
            const itemsRes = await fetch(itemsUrl);
            const items = await itemsRes.json();
            
            items.forEach(item => {
                groupedReviews[run.company.id].push({
                    reviewId: item.reviewId,
                    name: item.name,
                    avatar: item.avatar,
                    date: item.date,
                    title: item.reviewTitle,
                    text: item.reviewText,
                    rating: parseInt(item.ratingValue, 10)
                });
            });
            console.log(`✅ Fetched ${items.length} reviews for ${run.company.id}`);
        } catch (e) {
            console.error(`❌ Error fetching reviews for ${run.company.id}:`, e.message);
        }
    }

    // Fill in empty arrays for any companies that failed to scrape
    companies.forEach(c => {
        if (!groupedReviews[c.id]) {
            groupedReviews[c.id] = [];
        }
    });

    // Write to src/lib/reviews.json
    const outputPath = 'src/lib/reviews.json';
    writeFileSync(outputPath, JSON.stringify(groupedReviews, null, 2), 'utf8');
    console.log(`💾 Saved grouped reviews to ${outputPath}`);
}

main().catch(console.error);
