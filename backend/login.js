const mysql = require('mysql');
const uuid = require('uuid');

const login = (app) => {
    app.post('/login', (req, res) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'gena_booker'
        });
        const sessionId = uuid.v4();
        const query = `UPDATE users SET sessionId = '${sessionId}' where username = '${req.body.username}'`;
        connection.query(query, (error, results) => {
            if (error) {

                console.error('Ошибка при авторизации:', error);
                res.status(500).json({ success: false, error: 'Ошибка при авторизации' });
            } else {
                console.log('Пользователь успешно авторизован');
                console.log(`Login SessionId: ${sessionId}`);
                console.log(req.body);
                res.clearCookie('sessionId');
                res.cookie('sessionId', sessionId, { maxAge: 604800000, httpOnly: true });
                res.status(200).json({ success: true });
            }
        });
        connection.end();
        // console.log(req.body);
    });
}

module.exports = login;