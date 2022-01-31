const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'error' });

const models = require('../models');

module.exports = {
    findById, update
};

async function findById(shareDefinitionId) {
    var shareDefinition = await models.ShareDefinition.findOne({
        where: {
            id: shareDefinitionId
        }
    });
    return shareDefinition;
}

async function update(value, selector) {
    var shareDefinition = await models.ShareDefinition.update(value, selector);
    return shareDefinition;
}
