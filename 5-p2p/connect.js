g'use strict'
const topology = require('fully-connected-topology')

const me = process.argv[2]
const peers = process.argv.slice(3)

const t = topology(me, peers)

t.on('connection', (connection, peer) => {
  console.log(`connected to ${peer}`)
})
