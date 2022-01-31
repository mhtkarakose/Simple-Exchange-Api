const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'error' });

const models = require('../models');

module.exports = {
    findById
};
function findById(userId) {
    var user = (async () => {
        models.User.findOne({
            where: {
                id: userId
            }
        });
    })();

    return user;
}
