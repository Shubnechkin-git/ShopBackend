const { getData } = require('./misc');

const getHotItems = (app, connection) => {
    app.post('/hot_items', async (req, res) => {
        try {
            const data = await getData('hot', connection);
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
} 

const getNoveltyItems = (app, connection) => {
    app.post('/novelty_items', async (req, res) => {
        try {
            const data = await getData('nov', connection);
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}

const getDiscountItems = (app, connection) => {
    app.post('/discount_items', async (req, res) => {
        try {
            const data = await getData('disc', connection);
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}

const getProduct = (app, connection) => {
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