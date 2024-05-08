const mysql = require('mysql');
const { errorMonitor } = require('nodemailer/lib/xoauth2');

const getColor = (app, pool, connection) => {
    app.get('/getColor', async (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query(`SELECT * FROM settings`, (result, error) => {
                    if (error) {
                        connection.release();
                        return res.status(200).json({ success: true, colors: error, message: 'Настройки получены!' })
                    } else {
                        connection.release();
                        return res.status(500).json({ success: false, colors: error });
                    }
                });
            }
        }
        );
    });
}

const setColor = (app, pool, connection) => {
    app.post('/updateColor', async (req, res) => {

        const color = req.body.color;
        const section = req.body.section;
        const query = `UPDATE settings SET ${section} = ?`;
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query(query, color, (results, error) => {
                    if (error) {
                        connection.release();
                        return res.status(200).json({ success: true, message: 'Фон был успешно сохранен!' })
                    }
                    else {
                        console.error(error);
                        connection.release();
                        return res.status(500).json({ success: false, error: error, message: 'Произошла ошибка при обновление фона!' });
                    }
                });
            }
        }
        );
    });
};

const addProduct = (app, pool, connection) => {
    app.post('/add_product', (req, res) => {
        // console.log(req.body);
        const sql = `INSERT INTO ${req.body.table} (title, price, img, available) VALUES ('${req.body.newTitle}', '${req.body.newPriceValue}', '${req.body.imageBase64}', '${req.body.newAvilable}')`;
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: err, message: 'Ошибка при подключение к бд' });
            } else {
                connection.query(sql, (error, result) => {
                    if (result) {
                        connection.release();
                        return res.status(200).json({ success: true, data: result, message: "Продукт успешно добавлен!" });
                    }
                    else if (error) {
                        connection.release();
                        return res.status(500).json({ success: false, data: error, message: 'Ошибка при выполнение запроса!' });
                    }
                });
            }
        }
        );
        // res.status(200).json({ success: true, message: 'Продукт успешно добавлен' });
    })
}

const getAllProducts = (app, pool, connection) => {
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
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query(sql, (error, result) => {
                    if (result) {
                        connection.release();
                        return res.status(200).json({ success: true, data: result, message: "Товары получены!" });
                    }
                    else if (error) {
                        connection.release();
                        return res.status(500).json({ success: false, data: error });
                    }
                });
            }
        }
        );
    })
}

const changeStatus = (app, pool, connection) => {
    app.put('/change_status', (req, res) => {
        console.log(req.body);
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query(`UPDATE cart SET status = '${req.body.status}' WHERE id IN (${req.body.cart_id})`, (error, result) => {
                    if (result) {
                        if (req.body.status === 'rejected') {
                            connection.release();
                            return res.status(200).json({ success: true, data: result, message: "Заказ отклонен!" });
                        }
                        else if (req.body.status === 'completed') {
                            connection.release();
                            connection.query(`UPDATE ${req.body.table} SET available = available-${req.body.count} WHERE id =${req.body.product_id}`, (error, result) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ success: false, data: result, message: "Ошибка при пожтверждение!" });
                                }
                                else if (result) {
                                    return res.status(200).json({ success: true, data: result, message: "Заказ подтвержден!" });
                                    console.log(result);
                                }
                            })
                        }
                        else if (req.body.status === 'processing') {
                            connection.release();
                            return res.status(200).json({ success: true, data: result, message: "Заказ создан!" });
                        }
                        else {
                            connection.release();
                            return res.status(500).json({ success: false, data: result, message: "Такого статуса нет!" });
                        }
                    }
                    else if (error) {
                        connection.release();
                        return res.status(500).json({ success: false, data: error, message: "Ошибка при выполнение запроса!" });
                    }
                });

            }
        }
        );
    });
}

const getAllOrders = (app, pool, connection) => {
    app.get('/orders', (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query('SELECT cart.id, users.mail, users.number, cart.product_id, cart.count, cart.total_price, cart.table_name FROM `cart` JOIN users ON cart.user_id = users.id WHERE status LIKE "processing"', (error, result) => {
                    if (result) {
                        connection.release();
                        return res.status(200).json({ success: true, data: result, message: "Заказы получены получены!" });
                    }
                    else if (error) {
                        connection.release();
                        return res.status(500).json({ success: true, data: error });
                    }
                });
            }
        }
        );
    });
    // connection.release();
}


module.exports = {
    setColor,
    getColor,
    getAllProducts,
    getAllOrders,
    addProduct,
    changeStatus
};  