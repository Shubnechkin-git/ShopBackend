const { getData } = require('./misc');

const mysql = require('mysql');

const getHotItems = (app, pool, connection) => {
    app.post('/hot_items', async (req, res) => {
        try {
            const data = await getData('hot', pool, connection);
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}

const getNoveltyItems = (app, pool, connection) => {
    app.post('/novelty_items', async (req, res) => {
        try {
            const data = await getData('nov', pool, connection);
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}

const getDiscountItems = (app, pool, connection) => {
    app.post('/discount_items', async (req, res) => {
        try {
            const data = await getData('disc', pool, connection);
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}

const getProduct = (app, pool, connection) => {
    app.get('/product', (req, res) => {
        res.send(req);
    });
}

module.exports = {
    getHotItems,
    getNoveltyItems,
    getDiscountItems,
    getProduct
}