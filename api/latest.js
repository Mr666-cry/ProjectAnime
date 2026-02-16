const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const { data } = await axios.get('https://otakudesu.best', {
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const $ = cheerio.load(data);
        const results = [];

        // SCANNING & SCRAPING LOGIC
        $('.venutama .detpost').each((i, el) => {
            const item = $(el);
            const fullUrl = item.find('a').attr('href') || '';
            results.push({
                title: item.find('h2').text().trim(),
                thumb: item.find('img').attr('src'),
                ep: item.find('.epz').text().trim(),
                // Ambil slug dari URL (misal: https://otakudesu.best/anime/slug -> slug)
                slug: fullUrl.split('/').filter(Boolean).pop() 
            });
        });

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'SCAN_FAILED', detail: err.message });
    }
};
