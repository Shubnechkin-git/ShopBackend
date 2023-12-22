const express = require('express'); //Строка 1
const app = express(); //Строка 2
const port = process.env.PORT || 5000; //Строка 3
const path = require('path');
var mysql = require('mysql');
const bodyParser = require('body-parser');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'gena_booker'
// });

// let data;

// connection.connect();
// connection.query('SELECT * from items', function (error, results, fields) {
//     if (error) throw error;
//     data = results[0];
//     console.log('The solution is: ', results);
// });
// connection.end();

// Сообщение о том, что сервер запущен и прослушивает указанный порт 
app.listen(port, () => console.log(`Listening on port http://localhost:${port}`)); //Строка 6

// Создание GET маршрута
app.get('/express_backend', (req, res) => { //Строка 9
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Строка 10
}); //Строка 11

var cors = require('cors')
app.use(cors())
app.use(bodyParser.json());

const getData = (tag, callback) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'gena_booker'
    });

    connection.connect((err) => {
        if (err) {
            return callback(err, null);
        }

        if (tag === 'hot') {
            connection.query('SELECT * from items', (error, results) => {
                if (error) {
                    connection.end();
                    return callback(error, null);
                }

                connection.end();
                callback(null, results);
            });
        } else if (tag === 'disc') {
            connection.query('SELECT * from discounts', (error, results) => {
                if (error) {
                    connection.end();
                    return callback(error, null);
                }
                connection.end();
                callback(null, results);
            });
        }
        else if (tag === 'nov') {
            connection.query('SELECT * from novelty', (error, results) => {
                if (error) {
                    connection.end();
                    return callback(error, null);
                }
                connection.end();
                callback(null, results);
            });
        }
    });
};

app.get('/hot_items', (req, res) => {
    getData('hot', (error, data) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        res.send(data);
    });
});

app.get('/novelty_items', (req, res) => {
    getData('nov', (error, data) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        res.send(data);
    });
});

app.get('/discount_items', (req, res) => {
    getData('disc', (error, data) => {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
        res.send(data);
    });
});


app.post('/register', (req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'gena_booker'
    });
    console.log(req.body);
    const { username, mail, password, number } = req.body;
    const query = 'INSERT INTO users (username, mail, password, number) VALUES (?, ?, ?, ?)';
    connection.query(query, [username, mail, password, number], (error, results) => {
        if (error) {
            console.error('Ошибка при регистрации:', error);
            res.status(500).json({ success: false, error: 'Ошибка при регистрации' });
        } else {
            console.log('Пользователь успешно зарегистрирован');
            res.json({ success: true });
        }
    });
    connection.end();
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname+'/my-shop', 'build', 'index.html'));
  });
