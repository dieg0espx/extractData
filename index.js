const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors());
const port = 3000; // Set your desired port number



app.get('/items', async (req, res) => {
  try {
    const { url } = req.query; // Extract the 'url' query parameter
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let title = '';
    let description = '';
    let image = '';

    // Extract the product title
    title = $('.item-primary h1').text();

    // Extract product descriptions
    $('.key-features li').each((index, element) => {
      const listItem = $(element);
      description += listItem.text() + '\n';
    });

    // Process additional descriptions
    $('.key-features p').each((index, element) => {
      const paragraph = $(element);
      const text = paragraph.text();
      description += text + '\n';
    });

    // Extract the product image source
    const imgElement = $('#prod-img-container img');
    const src = imgElement.attr('data-src');
    image = src || '';

    res.json({ title:title, description:description, image:image });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
