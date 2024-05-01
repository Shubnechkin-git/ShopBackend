const getColor = (app, connection) => {
    app.get('/getColor', async (req, res) => {
        connection.query(`SELECT * FROM settings`, (result, error) => {
            if (error) {
                return res.status(200).json({ success: true, colors: error, message: 'Настройки получены!' })
            } else {
                return res.status(500).json({ success: false, colors: error });
            }
        });
    });
}

const setColor = (app, connection) => {
    app.post('/updateColor', async (req, res) => {

        const color = req.body.color;
        const section = req.body.section;
        const query = `UPDATE settings SET ${section} = ?`;

        connection.query(query, color, (results, error) => {
            if (error) {
                return res.status(200).json({ success: true, message: 'Фон был успешно сохранен!' })
            }
            else {
                console.error(error);
                return res.status(500).json({ success: false, error: error, message: 'Произошла ошибка при обновление фона!' });
            }
        });
    });
};

const getAllProducts = (app, connection) => {
    app.get('/get_all_products', (req, res) => {
        const sql = `
            SELECT id, title, price, img, 'discounts' as table_name, available FROM discounts
            UNION
            SELECT id, title, price, img, 'items' as table_name, available FROM items
            UNION
            SELECT id, title, price, img, 'novelty' as table_name, available FROM novelty
            UNION
            SELECT id, title, price, img, 'products' as table_name, available FROM products
        `;
        connection.query(sql, (error, result) => {
            if (result) {
                return res.status(200).json({ success: true, data: result, message: "Товары получены!" });
            }
            else if (error) {
                return res.status(500).json({ success: false, data: error });
            }
        });
    })
}

const getAllOrders = (app, connection) => {
    
    app.get('/orders', (req, res) => {
        connection.query('SELECT * FROM cart', (error, result) => {
            if (result) {
                return res.status(200).json({ success: true, data: result, message: "Заказы получены получены!" });
            }
            else if (error) {
                return res.status(500).json({ success: true, data: error });
            }
        });
    });
    // connection.end();
}


module.exports = {
    setColor,
    getColor,
    getAllProducts,
    getAllOrders
}; 