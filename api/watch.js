const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    // Header bypass buat Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Ambil slug dari query params (contoh: /api/watch?slug=anime-judul-ep-1)
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: 'SLUG_REQUIRED_BANGSAT' });
    }

    // Otakudesu biasanya pake path /episode/ untuk halaman streaming
    const TARGET_URL = `https://otakudesu.best/episode/${slug}`;

    try {
        const { data } = await axios.get(TARGET_URL, {
            timeout: 7000,
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
            }
        });

        const $ = cheerio.load(data);
        
        // SELECTOR CRITICAL: Otakudesu simpen iframe di sini
        // Kita ambil iframe pertama (biasanya server default)
        const streamUrl = $('.responsive-embed-google iframe').attr('src') || 
                          $('.video-content iframe').attr('src') ||
                          $('#pembed iframe').attr('src');

        const title = $('.venutama h1').text().trim() || 'Streaming Anime';

        if (!streamUrl) {
            return res.status(404).json({ 
                error: 'VIDEO_NOT_FOUND', 
                msg: 'Iframe video gak ketemu, mungkin selector ganti atau link mati 💀' 
            });
        }

        res.status(200).json({
            title: title,
            streamUrl: streamUrl
        });

    } catch (err) {
        res.status(500).json({ 
            error: 'SCRAPE_WATCH_FAILED', 
            detail: err.message 
        });
    }
};
