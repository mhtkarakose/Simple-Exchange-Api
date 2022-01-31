const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'error' });

const models = require('../models');

module.exports = {
    findById, update
};

async function findById(userId, shareDefinitionId) {
    var portfolio = models.Portfolio.findOne({
        where: {
            userId: userId,
            shareDefinitionId: shareDefinitionId
        }
    });
    return portfolio;
}

async function update(value, selector) {
    var portfolio = await models.Portfolio.update(value, selector);
    return portfolio;
}