const express = require('express'); //Строка 1
const app = express(); //Строка 2
const port = process.env.PORT || 5000; //Строка 3
const path = require('path');
const mysql = require('mysql');
const axios = require('axios');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const login = require('./login');
const register = require('./register');
const { getHotItems, getNoveltyItems, getDiscountItems } = require('./items');
const { deleteFromCart, getUserCart, getAnyRoute, getExpressBackendRoute, checkUser, getUserInfo, checkSession, logutUser, addToCart, sendMail, search } = require('./routes');
const { setColor, getColor, getAllProducts, getAllOrders, addProduct, changeStatus, editProduct, delProduct } = require('./admin');
const { getCatalogItem } = require('./catalog');
// Сообщение о том, что сервер запущен и прослушивает указанный порт 
app.listen(port, () => console.log(`Listening on port http://localhost:${port}`)); //Строка 6
var cors = require('cors')

// URL вашего сервера
const url = 'https://testbuild-27ld.onrender.com/';

// Интервал пингования в миллисекундах (например, 1 минут)
const pingInterval = 13 * 60 * 1000;
// const pingInterval = 10 * 1000;

// Функция для пингования сервера
function pingServer() {
  axios.get(url)
    .then(() => {
      const now = new Date();
      const offset = now.getTimezoneOffset() / 60; // Получаем смещение часового пояса в часах
      const gmtPlusFour = now.getTime() + (offset + 4) * 60 * 60 * 1000; // Добавляем смещение часового пояса к времени
      const pingTime = new Date(gmtPlusFour).toLocaleString(); // Преобразуем время в локальную строку даты и времени
      console.log(`Pinged server at ${pingTime}`);
    })
    .catch((err) => {
      console.error(`Error pinging server: ${err.message}`);
    });
}


// Пингуем сервер каждые pingInterval миллисекунд
setInterval(pingServer, pingInterval);

if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000', // Укажите ваш домен React-приложения
    optionsSuccessStatus: 200, // некоторые старые браузеры (IE11, старый Android) не отправляют 204
  };
  app.use(express.static(path.join(__dirname, '../my-shop/build/')));
  app.use(cors(corsOptions));

} else {
  const corsOptions = {
    origin: 'https://testbuild-27ld.onrender.com/', // Укажите ваш домен React-приложения
    optionsSuccessStatus: 200, // некоторые старые браузеры (IE11, старый Android) не отправляют 204
  };
  app.use(cors(corsOptions));
  app.use(express.static(path.join(__dirname, '../build/')));
}

var pool;
var connection;

if (process.env.NODE_ENV === 'development') {
  connection = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gena_booker'
  });

  pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gena_booker'
  });
} else {
  connection = mysql.createConnection({
    host: 'bds8x3eqjt659zexhm6k-mysql.services.clever-cloud.com',
    user: 'ukpquiunilgd9a3d',
    password: 'sKRLt00lD4FffUASauii',
    database: 'bds8x3eqjt659zexhm6k',
    port: 3306
  });

  pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bds8x3eqjt659zexhm6k-mysql.services.clever-cloud.com',
    user: 'ukpquiunilgd9a3d',
    password: 'sKRLt00lD4FffUASauii',
    database: 'bds8x3eqjt659zexhm6k',
    port: 3306
  });
}

// AWy6bmydAyybAzzbdc8V email pass

app.use(bodyParser.json({ limit: '100mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content - Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {

    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

    return res.status(200).json({});

  }

  next();

})

console.log("NODE_ENV:", process.env.NODE_ENV);

app.options('/register', cors());
app.options('/catalog', cors());

register(app, pool, connection);

login(app, pool, connection);

getHotItems(app, pool, connection);

search(app, pool, connection); // поиск товара по /api?query=Товар1

getNoveltyItems(app, pool, connection);

getDiscountItems(app, pool, connection);

getCatalogItem(app, pool, connection); //возращает товары в каталог

checkUser(app, pool, connection);//проверяет есть ли пользователь в бд 

checkSession(app, pool, connection);//проверяет сессию 

getAnyRoute(app, pool, connection);//ответ на /*  

logutUser(app, pool, connection);//реагирует на конпку выход из профиля по пути /logout

getUserInfo(app, pool, connection);//ответ на user 

addToCart(app, pool, connection);//добавление товара в корзину /cart  

getUserCart(app, pool, connection); //ответ на /getCart - вывод товаров в корзину  

getExpressBackendRoute(app, pool, connection);//ответ на express_backend  

deleteFromCart(app, pool, connection);//удаляет овар из коризины 

setColor(app, pool, connection); //смена цвета заднего фона

getColor(app, pool, connection); //ответ на /getColor - вывод настройки цветов сайта  

getAllProducts(app, pool, connection); //ответ на /get_all_products - вывод товаров в адмиеку 

getAllOrders(app, pool, connection); //ответ на /orders - вывод товаров в адмиеку 

addProduct(app, pool, connection); //ответ на /add_product - добавление нового товара

editProduct(app, pool, connection); //ответ на /edit_product - редактирование товара

delProduct(app, pool, connection); //ответ на /del_product - удаление товара

changeStatus(app, pool, connection); //ответ на /change_ыtatus - смена статуса заказа

sendMail(app, pool, connection); //ответ на /send_email - отправка письма на почту

if (process.env.NODE_ENV === 'development') {
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../my-shop/build/', 'index.html'));
  });
} else {
  app.use((req, res) => {
    if (req.url != '/' && req.url != '/catalog' && req.url != '/profile' && req.url != '/about' && req.url != '/cart') {
      console.log(req.url);
      res.status(404).sendFile(path.join(__dirname, '../build', '404.html'));
    }
    else
      res.status(404).sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}