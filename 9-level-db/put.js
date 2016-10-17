const level = require('level')
const db = level('test')

db.put('testKey', 'testValue')
