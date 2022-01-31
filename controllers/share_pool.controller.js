const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'error' });

const models = require('../models');
const poolService = require('../services/share_pool.service')


router.get("/getAll", (req, res, next) => {
    models.Pool.findAll().then(users => {
        res.send(users);
    });
});

router.post('/bulk', async (req, res) => {
    // await poolService.send([
    //     { id: 1000, shareDefinitionId: 1000, stock: 10, userId: 1000, status: "BUY" },
    //     { id: 1001, definitionId: 1001, stock: 20, userId: 1001, status: "BUY" },
    //     { id: 1002, definitionId: 1002, stock: 30, userId: 1002, status: "BUY" },
    //     { id: 1003, definitionId: 1003, stock: 40, userId: 1003, status: "BUY" },
    //     { id: 1004, definitionId: 1004, stock: 50, userId: 1004, status: "BUY" },
    //     { id: 1000, shareDefinitionId: 1000, stock: 10, userId: 1000, status: "SELL" }
    // ]);
 
    for (let index = 0; index < req.length; index++) {
        var userId = req[index].userId;
        var shareDefinitionId = req[index].shareDefinitionId;
        var stock = req[index].stock;

        // user var mi 
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

        // def var mi
        var shareDefinition = await models.ShareDefinition.findOne({
            where: {
                id: shareDefinitionId
            }
        });
        if (shareDefinition == null || shareDefinition.length == 0) {
            return res.status(400).json({ message: "shareDefinition not found" });
        }

        // def stock var mi istenilen kadar
        if (status == "BUY" && shareDefinition.stock <= 0) {
            return res.status(400).json({ message: "not enough stock" });
        }

        if (status == "BUY" && shareDefinition.stock < stock) {
            return res.status(400).json({ message: "not enough stock" });
        }

        // portfolio var mi
        var portfolio = await models.Portfolio.findOne({
            where: {
                userId: userId,
                shareDefinitionId: shareDefinitionId
            }
        });
        if (portfolio == null || portfolio.length == 0) {
            return res.status(400).json({ message: "Portfolio not found" });
        }
        // kullanicida var mi okdr
        if (status == "SELL" && portfolio.stock < stock) {
            return res.status(400).json({ message: "user not enough stock" });
        }

        var status = req.body.status;

        var createdPool = await models.Pool.create({
            userId: userId,
            definitionId: shareDefinitionId,
            stock: stock,
            status: status
        });
        var selectorDef = {
            where: { id: shareDefinitionId }
        };
        var selectorPortfolio = {
            where: {
                userId: userId,
                shareDefinitionId: shareDefinitionId
            }
        };

        if (status == "BUY") {
            // // def stock dus 
            shareDefinition.stock = shareDefinition.stock - stock;
            shareDefinition = shareDefinition.dataValues

            var createdDef = await models.ShareDefinition.update(shareDefinition, selectorDef);

            // // portfolio stock ekle
            portfolio.stock = portfolio.stock + stock;
            portfolio = portfolio.dataValues;
            var createdPortfolio = await models.Portfolio.update(portfolio, selectorPortfolio);
        } else {
            // def stock dus 
            shareDefinition.stock = shareDefinition.stock + stock;
            shareDefinition = shareDefinition.dataValues

            var createdDef = await models.ShareDefinition.update(shareDefinition, selectorDef);

            // // portfolio stock ekle
            portfolio.stock = portfolio.stock - stock;
            portfolio = portfolio.dataValues;
            var createdPortfolio = await models.Portfolio.update(portfolio, selectorPortfolio);

        }
        return res.status(200).json({ createdPool: createdPool, currentDef: createdDef, currentPortfolio: createdPortfolio });
        
    }
});

router.post('/', async (req, res) => {

    var userId = req.body.userId;
    var shareDefinitionId = req.body.shareDefinitionId;
    var stock = req.body.stock;

    // user var mi 
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

    // def var mi
    var shareDefinition = await models.ShareDefinition.findOne({
        where: {
            id: shareDefinitionId
        }
    });
    if (shareDefinition == null || shareDefinition.length == 0) {
        return res.status(400).json({ message: "shareDefinition not found" });
    }

    // def stock var mi istenilen kadar
    if (status == "BUY" && shareDefinition.stock <= 0) {
        return res.status(400).json({ message: "not enough stock" });
    }

    if (status == "BUY" && shareDefinition.stock < stock) {
        return res.status(400).json({ message: "not enough stock" });
    }

    // portfolio var mi
    var portfolio = await models.Portfolio.findOne({
        where: {
            userId: userId,
            shareDefinitionId: shareDefinitionId
        }
    });
    if (portfolio == null || portfolio.length == 0) {
        return res.status(400).json({ message: "Portfolio not found" });
    }
    // kullanicida var mi okdr
    if (status == "SELL" && portfolio.stock < stock) {
        return res.status(400).json({ message: "user not enough stock" });
    }

    var status = req.body.status;

    var createdPool = await models.Pool.create({
        userId: userId,
        definitionId: shareDefinitionId,
        stock: stock,
        status: status
    });
    var selectorDef = {
        where: { id: shareDefinitionId }
    };
    var selectorPortfolio = {
        where: {
            userId: userId,
            shareDefinitionId: shareDefinitionId
        }
    };

    if (status == "BUY") {
        // // def stock dus 
        shareDefinition.stock = shareDefinition.stock - stock;
        shareDefinition = shareDefinition.dataValues

        var createdDef = await models.ShareDefinition.update(shareDefinition, selectorDef);

        // // portfolio stock ekle
        portfolio.stock = portfolio.stock + stock;
        portfolio = portfolio.dataValues;
        var createdPortfolio = await models.Portfolio.update(portfolio, selectorPortfolio);
    } else {
        // def stock dus 
        shareDefinition.stock = shareDefinition.stock + stock;
        shareDefinition = shareDefinition.dataValues

        var createdDef = await models.ShareDefinition.update(shareDefinition, selectorDef);

        // // portfolio stock ekle
        portfolio.stock = portfolio.stock - stock;
        portfolio = portfolio.dataValues;
        var createdPortfolio = await models.Portfolio.update(portfolio, selectorPortfolio);

    }
    return res.status(200).json({ createdPool: createdPool, currentDef: createdDef, currentPortfolio: createdPortfolio });
});

router.delete("/", (req, res, next) => {
    models.Pool.destroy({
        where: {},
        truncate: true
    }).then((val) => {
        return res.json({
            "message": val
        });
    });
});
module.exports = router;
