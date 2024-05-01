const { text } = require('express');
const path = require('path');

const sendMail = (app, connectio) => {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
        host: "smtp.mail.ru",
        port: 587,
        secure: false, // Use `true` for TLS
        auth: {
            user: "discursiveee@mail.ru",
            pass: "UsUhK7VygPsfWYxe5Ny9",
        },
    });
    app.post('/send_email', (req, res) => {
        console.log(req.body);
        if (req.body.type === 'contact')
            transporter.sendMail({
                from: '"GenaBooker_Store" <discursiveee@mail.ru>', // sender address
                to: req.body.mail, // list of receivers
                subject: `Спасибо за обращение в GenaBooker_Store, ${req.body.username}!`, // Subject line
                text: `Добрый день, ${req.body.username},\n\nСпасибо за обращение в GenaBooker_Store. Мы ценим ваше время и обязательно уделим внимание вашему вопросу.\n\nВы написали:\n\n${req.body.text}\n\nМы свяжемся с вами в ближайшее время, чтобы решить ваш вопрос.\n\nС уважением,\nКоманда GenaBooker_Store`, // plain text body
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 80%;
                        margin: auto;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px;
                        background-color: #343a40;
                        color: #fff;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .main-content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        background-color: #343a40;
                        color: #fff;
                        border-bottom-left-radius: 5px;
                        border-bottom-right-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>GenaBooker_Store</h1>
                    </div>
                    <div class="main-content">
                        <p>Добрый день, ${req.body.username}!</p>
                        <p>Спасибо за обращение в GenaBooker_Store. Мы ценим ваше время и обязательно уделим внимание вашему вопросу.</p>
                        <p>Вы написали:</p>
                        <p><strong>${req.body.text}</strong></p>
                        <p>Мы свяжемся с вами в ближайшее время по номеру телефона ${req.body.number}, чтобы решить ваш вопрос.</p>
                    </div>
                    <div class="footer">
                        <p>С уважением,</p>
                        <p>Команда GenaBooker_Store</p>
                    </div>
                </div>
            </body>
            </html> 
            `, // html body
            }, (error, info) => {
                // if (error) {
                // }
                if (info) return res.status(200).json({ success: true, data: info, message: 'Сообщение доставленно!' });
                else {
                    return res.status(500).json({ success: false, message: "Ошибка повторите позже!" });
                }
            });
        else if (req.body.type === 'order') {
            transporter.sendMail({
                from: '"GenaBooker_Store" <discursiveee@mail.ru>', // sender address
                to: req.body.email, // list of receivers
                subject: `Ваш заказ №X в GenaBooker_Store находится в обработке, ${req.body.firstname}!`, // Subject line orderNumber
                text: `Добрый день, ${req.body.firstname},\n\nВаш заказ №X в GenaBooker_Store находится в обработке. Мы ценим ваше время и обязательно уделим внимание вашему заказу.\n\nЗаказ:\n\n${req.body.order}\n\nДанные для доставки:\n\nФамилия: ${req.body.lastname}\nИмя: ${req.body.firstname}\nОтчество: ${req.body.patrynomic}\nEmail: ${req.body.email}\nТелефон: ${req.body.tel}\nАдрес: ${req.body.address}\n\nМы свяжемся с вами в ближайшее время по номеру телефона ${req.body.tel}, чтобы подтвердить ваш заказ.\n\nС уважением,\nКоманда GenaBooker_Store`, // plain text body orderNumber
                html: `
                      <!DOCTYPE html>
                      <html>
                      <head>
                          <style>
                              body {
                                  font-family: Arial, sans-serif;
                                  margin: 0;
                                  padding: 0;
                              }
                              .container {
                                  width: 80%;
                                  margin: auto;
                                  background-color: #f8f9fa;
                                  border-radius: 5px;
                                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                              }
                              .header {
                                  text-align: center;
                                  padding: 20px;
                                  background-color: #343a40;
                                  color: #fff;
                                  border-top-left-radius: 5px;
                                  border-top-right-radius: 5px;
                              }
                              .main-content {
                                  padding: 20px;
                              }
                              .footer {
                                  text-align: center;
                                  padding: 20px;
                                  background-color: #343a40;
                                  color: #fff;
                                  border-bottom-left-radius: 5px;
                                  border-bottom-right-radius: 5px;
                              }
                          </style>
                      </head>
                      <body>
                          <div class="container">
                              <div class="header">
                                  <h1>GenaBooker_Store</h1>
                              </div>
                              <div class="main-content">
                                  <p>Добрый день, ${req.body.firstname}!</p>
                                  <p>Ваш заказ №X в GenaBooker_Store находится в обработке. Мы ценим ваше время и обязательно уделим внимание вашему заказу.</p> //orderNumber
                                  <p>Заказ:</p>
                                  <p><strong>xxxxxxxxxxx</strong></p>//req.body.order
                                  <p>Данные для доставки:</p>
                                  <p><strong>Фамилия:</strong> ${req.body.lastname}</p>
                                  <p><strong>Имя:</strong> ${req.body.firstname}</p>
                                  <p><strong>Отчество:</strong> ${req.body.patrynomic}</p>
                                  <p><strong>Email:</strong> ${req.body.email}</p>
                                  <p><strong>Телефон:</strong> ${req.body.tel}</p>
                                  <p><strong>Адрес:</strong> ${req.body.address}</p>
                                  <p>Мы свяжемся с вами в ближайшее время по номеру телефона ${req.body.tel}, чтобы подтвердить ваш заказ.</p>
                              </div>
                              <div class="footer">
                                  <p>С уважением,</p>
                                  <p>Команда GenaBooker_Store</p>
                              </div>
                          </div>
                      </body>
                      </html>
              ` // html body
            }, (error, info) => {
                // if (error) {
                // }
                if (info) return res.status(200).json({ success: true, data: info, message: 'Сообщение доставленно!' });
                else {
                    return res.status(500).json({ success: false, message: "Ошибка повторите позже!" });
                }
            });
        } else { res.status(500).json({ success: false, message: 'Ошибка повторите позже!' }) }
    });
}

const getAnyRoute = (app, connection) => {
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

const getExpressBackendRoute = (app, connection) => {
    app.get('/express_backend', (req, res) => {
        res.send({ express: "Подключено" });
        console.log("App.js sessionId:", req.cookies.sessionId);
    });
}

const checkUser = (app, connection) => {
    app.post('/checkUser', (req, res) => {

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


    });
}

const getUserInfo = (app, connection) => {
    // Эндпоинт для получения информации о пользователе
    app.post('/user', (req, res) => {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            // Подключение к базе данных (замените значения на свои)

            // Подготовленный запрос для безопасности
            const query = 'SELECT id,username,mail,number,isAdmin FROM users WHERE sessionId = ?';

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

            });
        } else {
            res.json({ success: false, error: 'Отсутствует sessionId' });
        }
    });
}

const checkSession = (app, connection) => {
    app.get('/checkSession', (req, res) => {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            // Здесь вы должны выполнить запрос к базе данных для проверки существования сессии

            const query = 'SELECT COUNT(*) as count FROM users WHERE sessionId = ?';

            connection.query(query, [sessionId], (error, results) => {
                if (error) {
                    console.error('Ошибка при проверке сессии:', error);
                    res.status(500).json({ success: false, error: 'Ошибка при проверке сессии' });
                } else {
                    const sessionExists = results[0].count > 0;
                    res.json({ success: sessionExists });
                }


            });
        } else {
            res.json({ success: false });
        }
    });
}

const getProduct = (productId, categoryName, tableName, connection) => {
    return new Promise((resolve, reject) => {

        let productInfo = {
            table_name: tableName,
            title: null,
            price: null,
            img: null,
        };

        if (productInfo.table_name == null) {
            switch (categoryName) {
                case "Популярные товары":
                    productInfo.table_name = "items";
                    break;
                case "Новинки":
                    productInfo.table_name = "novelty";
                    break;
                case "Скидки":
                    productInfo.table_name = "discounts";
                    break;
                case "Каталог":
                    productInfo.table_name = "products";
                    break;
                default:
                    reject('Неверная категория товара');
                    return;
            }
        }

        const query = `SELECT * FROM ${productInfo.table_name} WHERE id = ?`;

        connection.query(query, [productId], (error, results) => {
            if (error) {

                reject('Ошибка при получении товара: ' + error.message);
            } else {
                if (results.length > 0) {
                    productInfo.title = results[0].title;
                    productInfo.price = results[0].price;
                    productInfo.img = results[0].img;

                    resolve(productInfo);
                } else {
                    reject('Товар с id ' + productId + ' не найден в таблице ' + table_name);
                }
            }
        });
    });
};


const addToCart = (app, connection) => {

    // SQL-запрос для добавления товара в корзину
    const addToCartQuery = `
        INSERT INTO cart (user_id, product_id, product_name, category, count, price, total_price, table_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE count = count + VALUES(count), total_price = count * price
    `;

    app.post('/cart', async (req, res) => {
        // Получение данных о товаре из тела запроса
        const { product_id, category, user_info, count } = req.body;

        // console.log(req.body);
        // Получение информации о товаре из product_info
        const product_info = await getProduct(product_id, category, null, connection); // Предполагается, что product_info содержит информацию о товаре

        // Проверка наличия необходимых данных
        if (!product_id || !category || !user_info || !product_info) {
            return res.status(400).json({ error: 'Недостаточно данных для добавления в корзину' });
        }

        // Попытка выполнить SQL-запрос
        connection.query(addToCartQuery, [user_info.id, product_id, product_info.title, category, count, product_info.price, product_info.price, product_info.table_name], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Произошла ошибка при добавлении товара в корзину' });
            } else {
                if (count == 1) {
                    return res.status(200).json({
                        success: true, message: 'Товар успешно добавлен в корзину!', data: {
                            product_id, product_info
                        }
                    });
                }
                else if (count == -1) {
                    return res.status(200).json({
                        success: true, message: 'Товар успешно удален из корзины!', data: {
                            product_id, product_info
                        }
                    });
                }
            }
        });
    });
};

const deleteFromCart = (app, connection) => {
    app.post('/deleteCart', async (req, res) => {

        const id = req.body.id;
        const query = `DELETE FROM cart WHERE id=?`;

        connection.query(query, id, (results, error) => {
            if (results) {
                console.log(results);
                return res.status(200).json({ success: true, message: 'Произошла ошибка при удаление товара из корзины!' })
            }
            else {
                console.error(error);
                return res.status(500).json({ success: false, error: 'Товар был успешно удален из корзины!' });
            }
        });
    });
}

const getUserCart = (app, connection) => {
    app.post('/getCart', async (req, res) => {
        const userId = req.body.sessionInfo.userInfo.id;
        if (req.body.cartProductId == null) {

            const query = `SELECT * FROM cart WHERE user_id = ?`;

            connection.query(query, [userId], async (error, results) => {
                if (error) {

                    console.error('Ошибка при получении корзины пользователя:', error);
                    res.status(500).json({ error: 'Ошибка при получении корзины пользователя' });
                } else {
                    try {
                        const cartItems = [];
                        for (const item of results) {
                            const productInfo = await getProduct(item.product_id, null, item.table_name, connection);
                            cartItems.push({ ...item, product_info: productInfo });
                        }

                        // console.log('Корзина пользователя успешно получена:', cartItems);
                        res.status(200).json(cartItems);
                    } catch (error) {
                        console.error('Ошибка при получении информации о продукте:', error);
                        res.status(500).json({ error: 'Ошибка при получении информации о продукте' });
                    }
                }
            });
        }
        else {
            const query = `SELECT * FROM cart WHERE id = ?`;

            connection.query(query, [req.body.cartProductId], async (error, results) => {
                if (error) {

                    console.error('Ошибка при получении корзины пользователя:', error);
                    res.status(500).json({ error: 'Ошибка при получении корзины пользователя' });
                } else {
                    try {
                        res.status(200).json(results[0]);
                    } catch (error) {
                        console.error('Ошибка при получении информации о продукте:', error);
                        res.status(500).json({ error: 'Ошибка при получении информации о продукте' });
                    }
                }
            });
        }
    });
};


const logutUser = (app, connection) => {
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
    logutUser,
    addToCart,
    getUserCart,
    deleteFromCart,
    sendMail
}