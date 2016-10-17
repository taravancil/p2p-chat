const level = require('level')
const db = level('test')

db.get('testKey', (err, data) => console.log(data))
