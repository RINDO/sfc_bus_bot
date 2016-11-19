'use strict';

const db     = require('./db.js');
const moment = require('moment');
const aa     = require('aa');

const LOC = {
  "k" : '慶応',
  "t" : '辻堂駅北口',
  "s" : '湘南台駅西口'
}

// exports --------------------------------------

exports.find_bus = aa.thunkify((f, t, hour, cb) => {
  aa(function* () {
    let from  = LOC[f];
    let to    = LOC[t];

    let result = yield db.find_bus(from, to, hour, 5);
    cb(toText(result));
  });
})

exports.find_next = aa.thunkify((f, t, cb) => {
  aa(function* () {
    let result = yield db.find_next_bus(f, t);
    cb(toText(result));
  });
});

exports.find_last = aa.thunkify((f, t, cb) => {
  aa(function* () {
    let result = yield db.find_last_bus(f, t);
    cb(toText(result));
  });
});

// private --------------------------------------

const toText = (result) => {
  var str = ""

  if (result.length < 1) {
    str = "その時間帯のバスはありません";
  } else {
    result.forEach((it, idx) => {
      str += it.hour + "時" + it.minute + "分発" + "(" + it.from_location + "発: " + it.btype + ")" ;

      if (idx+1 < result.length) { str += "\n"; }
    });
  }

  return str;
}