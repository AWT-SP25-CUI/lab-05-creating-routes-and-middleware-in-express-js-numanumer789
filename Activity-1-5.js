const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

app.get('/users/:id/orders/:orderId', (req, res) => {
    res.send(`User ${req.params.id} Order ${req.params.orderId}`);
});

app.get('/search', (req, res) => {
    const query = req.query.q;
    res.send(`Search query: ${query}`);
});

app.get('/products', (req, res) => {
    const { category, maxPrice } = req.query;

    res.send(`Category: ${category}, Max Price: ${maxPrice}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


