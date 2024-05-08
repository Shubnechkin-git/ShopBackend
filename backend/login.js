const mysql = require('mysql');
const uuid = require('uuid');

const login = (app, pool, connection) => {
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        console.log(req.body);
        // Проверка существования пользователя
        const userQuery = `SELECT * FROM users WHERE username = ? AND password = ?`;
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query(userQuery, [username, password], (error, userResults) => {
                    if (error) {
                        console.error('Ошибка при проверке пользователя:', error);
                        res.status(500).json({ success: false, error: 'Ошибка при авторизации!' });
                    } else if (userResults.length === 0) {
                        // Пользователь не найден или неверный пароль
                        res.status(401).json({ success: false, error: 'Неверные учетные данные!' });
                    } else {
                        // Пользователь найден, выдаем sessionId 
                        const sessionId = uuid.v4();
                        const updateQuery = `UPDATE users SET sessionId = ? WHERE username = ?`;
                        connection.query(updateQuery, [sessionId, username], (updateError) => {
                            if (updateError) {
                                console.error('Ошибка при обновлении sessionId:', updateError);
                                connection.release();
                                res.status(500).json({ success: false, error: 'Ошибка при авторизации' });
                            } else {
                                console.log('Пользователь успешно авторизован');
                                console.log(`Login SessionId: ${sessionId}`);
                                connection.release();
                                res.clearCookie('sessionId');
                                res.cookie('sessionId', sessionId, { maxAge: 604800000, httpOnly: true });
                                res.status(200).json({ success: true });
                            }

                            // Закрываем соединение после завершения всех запросов  
                        });
                    }
                });
            }
        }
        );
    });
}

module.exports = login;
