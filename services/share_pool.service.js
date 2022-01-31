const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'error' });

const userService = require("./user.service");
const portfolioService = require("./portfolio.service");
const shareDefinitionService = require("./share_definition.service");
const models = require('../models');

module.exports = {
    send, create
};


function send(pool) {
    try {
        pool.forEach(value => {
            console.log(value);
            // user var mi 
            if (value.userId == null || value.shareDefinitionId == null) {
                return res.status(400).json({ message: "not null atr userId and defId" });
            }
            // check user exit
            var user = (async () => {
                userService.findById(value.userId).catch((val) => {
                    return res.status(500).json({
                        "message": val
                    });
                });
            })();
            console.log("burada1");

            if (user == null || user.length == 0) {
                return res.status(400).json({ message: "user not found" });
            }

            // def var mi
            var shareDefinition = (async () => {
                shareDefinitionService.findById(value.shareDefinitionId).catch((val) => {
                    return res.status(500).json({
                        "message": val
                    });
                });
            })();
            console.log(shareDefinition);

            if (shareDefinition == null || shareDefinition.length == 0) {
                return res.status(400).json({ message: "shareDefinition not found" });
            }
            // def stock var mi istenilen kadar
            if (value.status == "BUY" && shareDefinition.stock <= 0) {
                return res.status(400).json({ message: "not enough stock" });
            }
            if (value.status == "BUY" && shareDefinition.stock < stock) {
                return res.status(400).json({ message: "not enough stock" });
            }
            // portfolio var mi
            var portfolio = portfolioService.findById(value.userId, value.shareDefinitionId);
            console.log("burada123");
            if (portfolio == null || portfolio.length == 0) {
                return res.status(400).json({ message: "Portfolio not found" });
            }
            // kullanicida var mi okdr
            if (value.status == "SELL" && portfolio.stock < stock) {
                return res.status(400).json({ message: "user not enough stock" });
            }
            create(value);

            var selectorDef = {
                where: { id: value.shareDefinitionId }
            };
            var selectorPortfolio = {
                where: {
                    userId: value.userId,
                    shareDefinitionId: value.shareDefinitionId
                }
            };
            if (value.status == "BUY") {
                // // def stock dus 
                shareDefinition.stock = shareDefinition.stock - value.stock;
                shareDefinition = shareDefinition.dataValues;
                shareDefinitionService.update(shareDefinition, selectorDef);

                // // portfolio stock ekle
                portfolio.stock = portfolio.stock + stock;
                portfolio = portfolio.dataValues;
                portfolioService.update(portfolio, selectorPortfolio);
            } else if (value.status == "SELL") {
                shareDefinition.stock = shareDefinition.stock + value.stock;
                shareDefinition = shareDefinition.dataValues

                shareDefinitionService.update(shareDefinition, selectorDef);

                portfolio.stock = portfolio.stock - value.stock;
                portfolio = portfolio.dataValues;
                portfolioService.update(portfolio, selectorPortfolio);
            }
        });
        return 0;
    } catch (e) {
        console.error(e.message);

    }
}

async function create(value) {
    var createdPool = await models.Pool.create({
        userId: value.userId,
        definitionId: value.shareDefinitionId,
        stock: value.stock,
        status: value.status
    });
    return createdPool;
} 