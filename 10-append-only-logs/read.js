const scuttleup = require('scuttleup')
const level = require('level')
const db = scuttleup(level('logs'))

const stream = db.createReadStream({valueEncoding: 'utf-8'})

stream.on('data', (data) => {
  console.log(data)
})
