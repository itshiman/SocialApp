const express = require('express');
const generateUploadURL = require('../lib/s3.js').generateUploadURL;

const uploadRouter = express.Router();

uploadRouter.route('/s3Url').get(async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

module.exports = uploadRouter;
