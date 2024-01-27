const path = require('path');
const mysql = require('mysql');

const getAnyRoute = (app) => {
    if (process.env.NODE_ENV === 'production') {
        // app.get("/*", function (req, res) {
        //     // res.sendFile(path.join(__dirname + './../my-shop', 'build', 'index.html'));
        //     res.sendFile(path.join(__dirname));
        //     // res.sendFile(path.join(__dirname + '/build', 'index.html'));
        // });
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../my-shop/build', 'index.html'));
        });
    }
}

const getExpressBackendRoute = (app) => {
    app.get('/express_backend', (req, res) => {
        res.send({ express: "Подключено" });
        console.log("App.js sessionId:", req.cookies.sessionId);
    });
}

const checkUser = (app) => {
    app.post('/checkUser', (req, res) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'gena_booker'
        });

        const { username, mail, number } = req.body;
        const query = 'SELECT COUNT(*) as count FROM users WHERE username = ? OR mail = ? Or number = ?';

        connection.query(query, [username, mail, number], (error, results) => {
            if (error) {
                console.error('Ошибка при проверке пользователя:', error);
                res.status(500).json({ success: false, error: 'Ошибка при проверке пользователя' });
            } else {
                const userExists = results[0].count > 0;
                res.json({ success: true, exists: userExists });
            }
        });

        connection.end();
    });
}

const getUserInfo = (app) => {
    // Эндпоинт для получения информации о пользователе
    app.post('/user', (req, res) => {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            // Подключение к базе данных (замените значения на свои)
            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'gena_booker',
            });

            // Подготовленный запрос для безопасности
            const query = 'SELECT username,mail,number FROM users WHERE sessionId = ?';

            connection.query(query, [sessionId], (error, results) => {
                if (error) {
                    console.error('Ошибка при запросе к базе данных:', error);
                    res.json({ success: false, error: 'Ошибка при запросе к базе данных' });
                } else {
                    if (results.length > 0) {
                        const userInfo = results[0]; // Предполагаем, что результат - это объект пользователя
                        res.json({ success: true, user: userInfo });
                    } else {
                        res.json({ success: false, error: 'Пользователь не найден' });
                    }
                }

                // Закрываем соединение с базой данных
                connection.end();
            });
        } else {
            res.json({ success: false, error: 'Отсутствует sessionId' });
        }
    });
}

const checkSession = (app) => {
    app.get('/checkSession', (req, res) => {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            // Здесь вы должны выполнить запрос к базе данных для проверки существования сессии
            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'gena_booker'
            });

            const query = 'SELECT COUNT(*) as count FROM users WHERE sessionId = ?';

            connection.query(query, [sessionId], (error, results) => {
                if (error) {
                    console.error('Ошибка при проверке сессии:', error);
                    res.status(500).json({ success: false, error: 'Ошибка при проверке сессии' });
                } else {
                    const sessionExists = results[0].count > 0;
                    res.json({ success: sessionExists });
                }

                connection.end();
            });
        } else {
            res.json({ success: false });
        }
    });
}
const logutUser = (app) => {
    app.post('/logout', (req, res) => {
        // Удаление куки сессии
        res.clearCookie('sessionId');
        res.json({ success: true });
    });
}

module.exports = {
    getAnyRoute,
    getExpressBackendRoute,
    checkUser,
    getUserInfo,
    checkSession,
    logutUser
}