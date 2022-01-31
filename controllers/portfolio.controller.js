const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const models = require('../models');

router.get("/getAll", (req, res, next) => {
    models.Portfolio.findAll().then(val => {
        res.send(val);
    });
});

router.get('/bulk', async (req, res) => {
    models.Portfolio.bulkCreate([
        { id: 1000, shareDefinitionId: 1000, stock: 0, userId: 1000 },
        { id: 1001, shareDefinitionId: 1001, stock: 0, userId: 1001 },
        { id: 1002, shareDefinitionId: 1002, stock: 0, userId: 1002 },
        { id: 1003, shareDefinitionId: 1003, stock: 0, userId: 1003 },
        { id: 1004, shareDefinitionId: 1004, stock: 0, userId: 1004 },
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

router.post('/', async (req, res) => {

    var userId = req.body.userId;
    var shareDefinitionId = req.body.shareDefinitionId;
    if (userId == null || shareDefinitionId == null) {
        return res.status(400).json({ message: "not null atr userId and defId" });
    }

    // check user exit
    var user = await models.User.findAll({
        where: {
            id: userId
        }
    });

    if (user.length == 0) {
        return res.status(400).json({ message: "user not found" });
    }

    // check share def exit
    var shareDefinition = await models.ShareDefinition.findAll({
        where: {
            id: shareDefinitionId
        }
    });

    if (shareDefinition.length == 0) {
        return res.status(400).json({ message: "shareDefinition not found" });
    }

    // exist portfolio
    var Portfolio = await models.Portfolio.findAll({
        where: {
            shareDefinitionId: shareDefinitionId,
            userId: userId
        }
    });

    if (Portfolio.length != 0) {
        return res.status(400).json({ message: "Portfolio found" });
    }


    models.Portfolio.create({
        userId: req.body.userId,
        shareDefinitionId: req.body.shareDefinitionId,
        stock: 0
    }).then((val) => {
        return res.json({
            "message": val
        });
    });
});

router.delete("/", (req, res, next) => {
    models.Portfolio.destroy({
        where: {},
        truncate: true
    }).then((val) => {
        return res.json({
            "message": val
        });
    });
});
module.exports = router;
