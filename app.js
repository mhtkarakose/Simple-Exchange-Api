const express = require('express')
const config = require('./config/app.config.js');

const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const methodOverride = require('method-override');
const paginate = require('express-paginate');
const cors = require('cors');
const useragent = require('express-useragent');

const pino = require('pino');
const expressPino = require('express-pino-logger');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

const appRoutes = require('./routes/app.routes.js');

const app = express()
const http = require('http').Server(app);

const models = require("./models");

/**
 * Middleware section
 */
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(useragent.express());
// Logger init
app.use(expressLogger);

app.use(helmet()); 

/**
 * Router
 */
app.use(config.apiRouteV1, appRoutes); 

app.listen(config.port, () => {
    logger.info('Server running on port %d', config.port);

});

models.sequelize.sync();
