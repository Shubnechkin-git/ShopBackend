const mysql = require('mysql');

const getData = (tag, pool, connection) => {
    return new Promise((resolve, reject) => {
        let query = '';
        switch (tag) {
            case 'hot':
                query = 'SELECT * from items';
                break;
            case 'disc':
                query = 'SELECT * from discounts';
                break;
            case 'nov':
                query = 'SELECT * from novelty';
                break;
            default:
                return reject(new Error('Invalid tag'));
        }
        pool.getConnection((err, connection) => {
            if (err) {
                return reject({ success: false, error: 'Ошибка при подключение к бд' });
            } else {
                connection.query(query, (error, results) => {
                    if (error) {
                        connection.release();
                        return reject(error);
                    }
                    connection.release();
                    resolve(results);
                });
            }
        }
        );
    });
};

const getUser = (sessionId, callback, pool, connection) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(error, null);
        } else {
            connection.query(`SELECT username FROM users WHERE session = ${sessionId}`, (error, results) => {
                if (error) {
                    connection.release();
                    return callback(error, null);
                }
                connection.release();
                callback(null, results);
            });
        }
    }
    );
}

module.exports = { getData, getUser };
