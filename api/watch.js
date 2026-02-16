const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const { slug } = req.query;
    const BASE_URL = 'https://anikai.to';
    try {
        const { data } = await axios.get(`${BASE_URL}/${slug}`, { 
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        const $ = cheerio.load(data);
        const videoSrc = $('.video-content iframe').attr('src') || $('.embed-border iframe').attr('src');
        res.status(200).json({
            title: $('.entry-title').text().trim(),
            streamUrl: videoSrc
        });
    } catch (err) {
        res.status(500).json({ error: 'FAILED' });
    }
};
              
