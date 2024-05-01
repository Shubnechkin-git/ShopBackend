const mysql = require('mysql');

const getCatalogItem = (app, connection) => {
    app.get('/catalog', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        connection.query('SELECT * from products', (error, results) => {
            if (error) {
                console.error('Ошибка при выполнении запроса:', error);
                res.status(500).json({ error: 'Произошла ошибка при получении каталога товаров.' });
                return;
            }
            // Закрытие соединения с базой данных
            res.send(JSON.stringify(results));
        });
    });
}

module.exports = {
    getCatalogItem
}
