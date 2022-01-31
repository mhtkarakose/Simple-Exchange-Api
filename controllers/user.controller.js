const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const models = require('../models');

router.get("/getAll", (req, res, next) => {
    models.User.findAll().then(users => {
        res.send(users);
    });
});

router.get('/bulk', async (req, res) => {
    models.User.bulkCreate([
        { id: 1000, username: 'barfooz' },
        { id: 1001, username: 'foo' },
        { id: 1002, username: 'bar' },
        { id: 1003, username: 'stage' },
        { id: 1004, username: 'ala' },
    ]).then((value) => {
        return res.json({
            "message": value
        });
    }).catch((value) => {
        return res.status(500).json({
            "message": value
        });
    });
});

router.post('/', (req, res) => {
    models.User.create({
        username: req.body.username,
    }).then((value) => {
        return res.json({
            "message": value
        });
    });
});

router.delete("/", (req, res, next) => {
    models.User.destroy({
        where: {},
        truncate: true
    }).then((val) => {
        return res.json({
            "message": val
        });
    });
});
module.exports = router;
