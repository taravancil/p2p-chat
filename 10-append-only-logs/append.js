const scuttleup = require('scuttleup')
const level = require('level')
const db = scuttleup(level('logs'))

db.append('hello world')
