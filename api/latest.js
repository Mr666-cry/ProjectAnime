const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const BASE_URL = 'https://anikai.to';
    try {
        const { data } = await axios.get(BASE_URL, { 
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        const $ = cheerio.load(data);
        const results = [];
        $('.listupd .bs').each((i, el) => {
            results.push({
                title: $(el).find('.tt').text().trim(),
                thumb: $(el).find('img').attr('src'),
                ep: $(el).find('.epx').text().trim(),
                slug: $(el).find('a').attr('href').replace(BASE_URL + '/', '').replace(/\/$/, '')
            });
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'FAILED' });
    }
};
