const mysql = require('mysql');

const getCatalogItem = (app, pool, connection) => {
    app.get('/get_catalog', (req, res) => {
        res.setHeader('Content-Type', 'application/json'); 
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                // connection.query('SELECT * from products ORDER BY price DESC', (error, results) => {
                connection.query(`SELECT * from products ORDER BY price ${req.query.sortType}`, (error, results) => {
                    if (error) {
                        console.error('Ошибка при выполнении запроса:', error);
                        connection.release();
                        res.status(500).json({ error: 'Произошла ошибка при получении каталога товаров.' });
                        return;
                    }
                    // Закрытие соединения с базой данных
                    connection.release();
                    res.send(JSON.stringify(results));
                });
            }
        }
        );
    });
}

module.exports = {
    getCatalogItem
}
