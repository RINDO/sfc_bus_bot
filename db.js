'use strict';

const aa     = require('aa');
const pg     = require('pg');
const moment = require('moment-timezone');
const config = require('./config.js');
const pool   = new pg.Pool({
  user: config.DB.USER,
  database: config.DB.NAME,
  password: config.DB.PASSWD,
  host: config.DB.HOST,
  port: config.DB.PORT
}); 

const DATE_TYPE = {
  WEEKDAY:  0,
  SATURDAY: 1,
  HOLIDAY:  2
}

// exports --------------------------------------

exports.find_bus = aa.thunkify((from, to, hour, limit, cb) => {
  let now = moment().tz("Asia/Tokyo");
  pool.connect((err, client, done) => {
    client.query(
      'SELECT * FROM time_tables WHERE from_location = $1 AND to_location = $2 AND dtype = $3 AND ((hour = $4 AND minute >= $5) OR (hour > $4 AND minute > 0)) LIMIT $6',
      [from, to, dtype(), hour, now.minute(), limit],
      (err, result) => { 
        done(); 
        if   (err) { cb([]); }
        else { cb(result.rows); }
      });
  });
});

exports.find_next_bus = aa.thunkify((from, to, cb) => {
  let now = moment().tz("Asia/Tokyo");
  pool.connect((err, client, done) => {
    client.query(
      'SELECT * FROM time_tables WHERE from_location = $1 AND to_location = $2 AND dtype = $3 AND ((hour = $4 AND minute >= $5) OR (hour > $4 AND minute > 0)) LIMIT 1',
      [from, to, dtype(), now.hour(), now.minute()],
      (err, result) => { 
        done(); 
        if   (err) { cb([]); }
        else { cb(result.rows); }
      });
  });
});

exports.find_last_bus = aa.thunkify((from, to, cb) => {
  pool.connect((err, client, done) => {
    client.query(
      'SELECT * FROM time_tables WHERE from_location = $1 AND to_location = $2 AND dtype = $3 ORDER BY hour DESC, minute DESC LIMIT 1',
      [from, to, dtype()],
      (err, result) => { 
        done(); 
        if   (err) { cb([]); }
        else { cb(result.rows); }
      });
  });
});

// private --------------------------------------

const dtype = () => {
  let it = moment().format('dddd')

  if (it == 0)      return DATE_TYPE.HOLIDAY;
  else if (it == 6) return DATE_TYPE.SATURDAY;
  else              return DATE_TYPE.WEEKDAY;
}