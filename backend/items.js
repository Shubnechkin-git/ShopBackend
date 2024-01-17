const { getData } = require('./misc');

const getHotItems = (app) => {
    app.get('/hot_items', (req, res) => {
        getData('hot', (error, data) => {
            if (error) {
                return res.status(500).send('Internal Server Error');
            }
            res.send(data);
        });
    });
}

const getNoveltyItems = (app) => {
    app.get('/novelty_items', (req, res) => {
        getData('nov', (error, data) => {
            if (error) {
                return res.status(500).send('Internal Server Error');
            }
            res.send(data);
        });
    });
}

const getDiscountItems = (app) => {
    app.get('/discount_items', (req, res) => {
        getData('disc', (error, data) => {
            if (error) {
                return res.status(500).send('Internal Server Error');
            }
            res.send(data);
        });
    });
}

const getProduct = (app) => {
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