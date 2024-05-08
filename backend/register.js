const uuid = require('uuid');

const mysql = require('mysql');

const register = (app, pool, connection) => {
    app.post('/register', (req, res) => {
        console.log(req.body);
        const { username, mail, password, number } = req.body;
        const sessionId = uuid.v4();
        const query = 'INSERT INTO users (username, mail, password, number, sessionId) VALUES (?, ?, ?, ?, ?)';
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query(query, [username, mail, password, number, sessionId], (error, results) => {
                    if (error) {
                        console.error('Ошибка при регистрации:', error);
                        connection.release();
                        res.status(500).json({ success: false, error: 'Ошибка при регистрации' });
                    } else {
                        console.log('Пользователь успешно зарегистрирован');
                        console.log(`Register SessionId: ${sessionId}`);
                        connection.release();
                        res.cookie('sessionId', sessionId, { maxAge: 604800000, httpOnly: true });
                        res.json({ success: true });
                    }
                });
            }
        }
        );
    });
}

module.exports = register;