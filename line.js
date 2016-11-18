'use strict';

const config    = require('./config.js');
const templetes = require('./message_templates.js');
const qa        = require('./questions.js');
const bus       = require('./bus.js');
const lineMsg   = require('./line_message_object.js');
const crypto    = require('crypto');
const aa        = require('aa');
const request   = require('request');
const _         = require('lodash');

// exports --------------------------------------

exports.verify = (req) => {
  // see: https://devdocs.line.me/ja/#webhook
  let signature = req.headers['x-line-signature'];
  let digest = crypto.createHmac('SHA256', config.LINE.CHANNEL_SECRET).update(req.rawBody).digest('base64');

  return signature && (signature == digest);
};

exports.reply = (body) => {
  // see: https://devdocs.line.me/ja/#webhook-event-object
  _.each(body.events, (it) => {
    if (it.source.type != 'user') return;

    let token = it.replyToken;
    let uid   = it.source.userId;

    if (it.type == 'follow') { sendWelcome(uid); return; }
    if (it.type == 'postback') { handleCommand(token, it.postback.data); return; }
    if (it.message.type != 'text') { handleError(token); return;}

    handleReply(it.message.text, token);
  });
}

// private --------------------------------------

const handleReply = (text, token) => {aa(function *() { 

  let type = qa.detect_action(text);

  if (type == qa.TYPE.HELP) {
    sendUsage(token); return;
  }

  if (type == qa.TYPE.NEXT_BUS) {
    sendAskNext(token); return;
  }

  if (type == qa.TYPE.LAST_BUS) {
    sendAskLast(token); return;
    return;
  }

  if (type == qa.TYPE.CANCEL) {
    return;
  }

  // 該当しなかったら
  let p = text.split(" ");

  if (p.length < 3) { 
    handleError(token);
  } else {
    let candicates = yield bus.find_bus(p[0], p[1], p[2])
    sendMessage(token, [lineMsg.text(candicates)]);
  }
});}

const handleCommand = (token, cmd) => {aa(function *() { 
  // action=xx&...の形
  let p = {}
  cmd.split('&')
     .map(it => it.split('='))
     .map(it =>  p[it[0]] = it[1]);

  if (p.action == qa.TYPE.CANCEL) return;

  if (p.action == qa.TYPE.HELP) {
    sendUsage(token, p.type);
  }
 
  if (p.action == qa.TYPE.NEXT_BUS) {
    let result   = yield bus.find_next(p.from, p.to);
    sendMessage(token, [lineMsg.text(result)]);
  }

  if (p.action == qa.TYPE.LAST_BUS) {
    let result   = yield bus.find_last(p.from, p.to);
    sendMessage(token, [lineMsg.text(result)]);
  }
});}

const sendWelcome = (uid) => {
  pushMessage(uid, templetes.WELCOME);
}

const handleError = (token) => {
  sendMessage(token, templetes.ERROR);
}

const sendUsage = (token, type) => {
  if (type == undefined) {
    sendMessage(token, templetes.ASK_USAGE);
  } else {
    sendMessage(token, templetes.USAGE[type.toUpperCase()]);
  }
}

const sendAskNext = (token) => {
  sendMessage(token, templetes.ASK_NEXT);
}

const sendAskLast = (token) => {
  sendMessage(token, templetes.ASK_LAST);
}

// API ------------------------------------------

const pushMessage = (uid, messages) => {
  // see: https://devdocs.line.me/ja/#push-message
  if (messages.length == 0 || 5 < messages.length) return;

  const options = {
    url: `${config.LINE.ENDPOINT}/push`,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer' + ' ' + config.LINE.ACCESS_TOKEN
    },
    body: {
      'to': uid,
      'messages': messages
    },
    json: true
  };

  request.post(options, (error, res, body) => {
    if (res.statusCode != 200) { console.error(body); }
  });
}

const sendMessage = (token, messages) => {
  // see: https://devdocs.line.me/ja/#reply-message
  if (messages.length == 0 || 5 < messages.length) return;

  const options = {
    url: `${config.LINE.ENDPOINT}/reply`,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer' + ' ' + config.LINE.ACCESS_TOKEN
    },
    body: {
      'replyToken': token,
      'messages': messages
    },
    json: true
  }

  request.post(options, (error, res, body) => {
    if (res.statusCode != 200) { console.error(body); }
  });
};