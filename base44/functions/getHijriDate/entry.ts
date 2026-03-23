Deno.serve(async (req) => {
    try {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        // Try to fetch from the Hijri API with the correct JSON format parameter
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        let hijriData;
        try {
            const apiUrl = `https://www.habibur.com/hijri/api01/date/?format=json`;
            console.log('Fetching Hijri date from:', apiUrl);
            
            const response = await fetch(apiUrl, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ZahoorApp/1.0)'
                }
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Hijri API returned ${response.status}`);
            }

            hijriData = await response.json();
            console.log('Hijri API response:', hijriData);
        } catch (apiError) {
            clearTimeout(timeoutId);
            console.error("External Hijri API failed:", apiError.message);
            
            // Fallback: return current approximate Islamic date
            const now = new Date();
            const approximateHijriYear = Math.floor(((now.getFullYear() - 622) * 365.25) / 354.37) + 1;
            hijriData = {
                date: `${approximateHijriYear}-07-15`, // Approximate fallback
                error: "Using approximate date due to API unavailability"
            };
        }

        return new Response(JSON.stringify(hijriData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error("Function error:", error);
        
        // Return fallback data even in case of total failure
        return new Response(JSON.stringify({
            date: "1446-07-15", // Static fallback date
            error: "Service temporarily unavailable",
            fallback: true
        }), {
            status: 200, // Return 200 to prevent frontend errors
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
});