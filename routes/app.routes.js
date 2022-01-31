/**
 * API Routers
 */
const express = require('express');
const app = express.Router(); 

app.get('/', (req, res) => res.send('Hello World! -v1')); 
app.use("/user", require('../controllers/user.controller')); 
app.use("/shareDefinition", require('../controllers/share_definition.controller')); 
app.use("/sharePool", require('../controllers/share_pool.controller')); 
app.use("/portfolio", require('../controllers/portfolio.controller')); 

module.exports = app;
