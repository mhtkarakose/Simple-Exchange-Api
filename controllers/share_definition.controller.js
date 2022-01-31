const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const models = require('../models');


router.get("/getAll", (req, res, next) => {
    models.ShareDefinition.findAll().then(users => {
        return res.send(users);
    });
});

router.get('/bulk', async (req, res) => {
    req = [
        { id: 1000, name: 'BTC', price: 1000.01, stock: 500, creator: 1000 },
        { id: 1001, username: 'EOS', price: 1000.01, stock: 400, creator: 1001 },
        { id: 1002, username: 'BTT', price: 1000.01, stock: 300, creator: 1002 },
        { id: 1003, username: 'AVA', price: 1000.01, stock: 200, creator: 1003 },
        { id: 1004, username: 'MAN', price: 1000.01, stock: 100, creator: 1004 },
    ]

    req.forEach(element => {
        run(element, res)
    });
    return res.send("hll");
});

router.post('/', async (req, res) => {
    var name = req.body.name.toUpperCase();
    if (name.length > 3 || name.length == 0) {
        return res.status(400).json({ message: "name should be 3 characters" });
    }
    var stock = req.body.stock;
    if (stock <= 0) {
        return res.status(400).json({ message: "stock should be pozitif number" });
    }

    // check unique
    var shareDefinition = await models.ShareDefinition.findAll({
        where: {
            name: name
        }
    });

    if (shareDefinition.length != 0) {
        return res.status(400).json({ message: "name should be unique" });
    }

    models.ShareDefinition.create({
        name: name,
        price: req.body.price.toFixed(2),
        stock: stock,
        creator: req.body.creator,
    }).then((val) => {
        return res.json({
            "message": val
        });
    });
});

router.delete("/", (req, res, next) => {
    models.ShareDefinition.destroy({
        where: {},
        truncate: true
    }).then((val) => {
        return res.json({
            "message": val
        });
    });
});

module.exports = router;
