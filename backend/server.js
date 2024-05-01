const express = require('express'); //Строка 1
const app = express(); //Строка 2
const port = process.env.PORT || 5000; //Строка 3
const path = require('path');
const mysql = require('mysql');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const login = require('./login');
const register = require('./register');
const { getHotItems, getNoveltyItems, getDiscountItems, getProduct } = require('./items');
const { deleteFromCart, getUserCart, getAnyRoute, getExpressBackendRoute, checkUser, getUserInfo, checkSession, logutUser, addToCart, sendMail } = require('./routes');
const { setColor, getColor, getAllProducts, getAllOrders } = require('./admin');
const { getCatalogItem } = require('./catalog');
// Сообщение о том, что сервер запущен и прослушивает указанный порт 
app.listen(port, () => console.log(`Listening on port http://localhost:${port}`)); //Строка 6

var cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:3000', // Укажите ваш домен React-приложения
  optionsSuccessStatus: 200, // некоторые старые браузеры (IE11, старый Android) не отправляют 204
};

// var cors = require('cors')
// const corsOptions = {
//   origin: 'https://testbuild-27ld.onrender.com/', // Укажите ваш домен React-приложения
//   optionsSuccessStatus: 200, // некоторые старые браузеры (IE11, старый Android) не отправляют 204
// };

// AWy6bmydAyybAzzbdc8V email pass

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../my-shop/build/')));
// app.use(express.static(path.join(__dirname, '../build/')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content - Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {

    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

    return res.status(200).json({});

  }

  next();

})

app.options('/register', cors());
app.options('/catalog', cors());

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gena_booker'
});

// const connection = mysql.createConnection({
//   host: 'bds8x3eqjt659zexhm6k-mysql.services.clever-cloud.com',
//   user: 'ukpquiunilgd9a3d',
//   password: 'sKRLt00lD4FffUASauii',
//   database: 'bds8x3eqjt659zexhm6k',
//   port: 3306
// });

register(app, connection);

login(app, connection);

getHotItems(app, connection);

getNoveltyItems(app, connection);

getDiscountItems(app, connection);

getProduct(app, connection); //возращает  

getCatalogItem(app, connection); //возращает товары в каталог

checkUser(app, connection);//проверяет есть ли пользователь в бд 

checkSession(app, connection);//проверяет сессию 

getAnyRoute(app, connection);//ответ на /*  

logutUser(app, connection);//реагирует на конпку выход из профиля по пути /logout

getUserInfo(app, connection);//ответ на user 

addToCart(app, connection);//добавление товара в корзину /cart  

getUserCart(app, connection); //ответ на /getCart - вывод товаров в корзину  

getExpressBackendRoute(app, connection);//ответ на express_backend  

deleteFromCart(app, connection);//удаляет овар из коризины 

setColor(app, connection); //смена цвета заднего фона

getColor(app, connection); //ответ на /getColor - вывод настройки цветов сайта  

getAllProducts(app, connection); //ответ на /get_all_products - вывод товаров в адмиеку 

getAllOrders(app, connection); //ответ на /orders - вывод товаров в адмиеку 

sendMail(app, connection); //ответ на /send_email - отправка письма на почту

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../my-shop/build/', 'index.html'));
});

// app.use((req, res) => {
//   if (req.url != '/' && req.url != '/catalog' && req.url != '/profile' && req.url != '/about' && req.url != '/cart') {
//     console.log(req.url);
//     res.status(404).sendFile(path.join(__dirname, '../build', '404.html'));
//   }
//   else
//     res.status(404).sendFile(path.join(__dirname, '../build', 'index.html'));
// });
