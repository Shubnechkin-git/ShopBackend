const path = require('path');

const getAnyRoute = (app) => {
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname + '/../my-shop', 'build', 'index.html'));
        // res.sendFile(path.join(__dirname + '/my-shop', 'build', 'index.html'));
    });
}

const getExpressBackendRoute = (app) => {
    app.get('/express_backend', (req, res) => {
        res.send({ express: "Подключено" });
        console.log("App.js sessionId:", req.cookies.sessionId);
    });
}

module.exports = {
    getAnyRoute,
    getExpressBackendRoute
}