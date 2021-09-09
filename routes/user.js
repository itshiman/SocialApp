const express = require('express');

const userRouter = express.Router();
const mongoose = require('mongoose');

const authenticate = require('../authenticate');

module.exports = userRouter;
