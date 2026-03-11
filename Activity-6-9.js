const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const port = 3000;

const myLogger = (req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
};

app.use(myLogger);

const authMiddleware = (req, res, next) => {
    const isAuthenticated = true;

    if (isAuthenticated) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

app.use(authMiddleware);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/submit-form', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    res.send(`Name: ${name}, Email: ${email}`);
});

app.use(bodyParser.json());

app.post('/submit-json', (req, res) => {
    const data = req.body;

    console.log(data);

    res.json({
        message: "JSON data received",
        data: data
    });
});

app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
    res.cookie('myCookie', 'hello', {
        maxAge: 900000,
        httpOnly: true
    });

    res.send("Cookie has been set");
});

app.get('/read-cookie', (req, res) => {
    const myCookieValue = req.cookies.myCookie;

    if (myCookieValue) {
        res.send(`Cookie value: ${myCookieValue}`);
    } else {
        res.send("Cookie not found");
    }
});

let items = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" }
];

app.use(express.json());

app.get('/items', (req, res) => {
    res.json(items);
});

app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const item = items.find(i => i.id === id);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

app.post('/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        title: req.body.title
    };

    items.push(newItem);

    res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = items.findIndex(i => i.id === id);

    if (index > -1) {
        items[index].title = req.body.title;
        res.json(items[index]);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = items.findIndex(i => i.id === id);

    if (index > -1) {
        items.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

const logger = (req, res, next) => {

    const log = `${new Date().toISOString()} | ${req.method} | ${req.url}\n`;

    fs.appendFile('logs.txt', log, (err) => {
        if (err) console.error("Error writing log");
    });

    next();
};

app.use(logger);

const products = [
    { id: 1, name: "Laptop", price: 900, category: "electronics", inStock: true },
    { id: 2, name: "Phone", price: 600, category: "electronics", inStock: true },
    { id: 3, name: "Shoes", price: 120, category: "fashion", inStock: false },
    { id: 4, name: "Watch", price: 200, category: "fashion", inStock: true }
];

app.get('/products', (req, res) => {

    let result = [...products];

    const { category, maxPrice, inStock } = req.query;

    if (category) {
        result = result.filter(p => p.category === category);
    }

    if (maxPrice) {
        result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (inStock) {
        result = result.filter(p => p.inStock === (inStock === "true"));
    }

    res.json(result);

});

app.get('/products/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);

});

app.post('/products', (req, res) => {

    const { name, price, category, inStock } = req.body;

    if (!name || !price || !category || typeof inStock !== "boolean") {
        return res.status(400).json({
            error: "Invalid or missing fields"
        });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        category,
        inStock
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });

});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});