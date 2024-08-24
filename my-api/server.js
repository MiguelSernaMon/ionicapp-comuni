const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let items = [
    { id: 1, name: 'Item 1', description: 'Description 1' },
    { id: 2, name: 'Item 2', description: 'Description 2' }
];

let counter = items.length;

// GET all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Delete a single item by ID
app.post('/api/delete', (req, res) => {
    const data = req.body;
    items = items.filter(item => item.id !== parseInt(data.id));
    res.status(200).json({ message: 'Item deleted' });
});

// POST a new item
app.post('/api/items', (req, res) => {
    console.log("creating producto");
    const productData = req.body;
    console.log(productData);


    const newItem = {
        id: counter + 1,
        name: productData.name,
        description: productData.description
    };
    counter++;
    items.push(newItem);
    res.status(201).json(newItem);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
