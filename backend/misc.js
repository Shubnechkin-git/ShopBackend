const mysql = require('mysql');

const getData = (tag, connection) => {
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

        connection.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

const getUser = (sessionId, callback, connection) => {
    connection.query(`SELECT username FROM users WHERE session = ${sessionId}`, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}

module.exports = { getData, getUser };
