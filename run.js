const app = require('./app');
const http = require('https');

http.createServer(app).listen(8080, '0.0.0.0');
