'use strict';

const express      = require('express');
const request      = require('request');
const line         = require('./line.js');
const bodyParser   = require('body-parser');
const rawBodySaver = (req, res, buf, enc) => {
  // see: https://github.com/expressjs/body-parser#verify
   req.rawBody = buf;
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ verify: rawBodySaver }));

// ----------------------------------------------

app.post('/callback', (req, res) => {
  if (line.verify(req)) {
    res.sendStatus(200);
    line.reply(req.body)
  } else {
    console.error('invalid signature');
    res.sendStatus(470);
  }
});

// ----------------------------------------------

app.listen(8000, () => {
  console.log('ready to service !!')
});