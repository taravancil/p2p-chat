'use strict'
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')
const topology = require('fully-connected-topology')

const me = process.argv[2]
const peers = process.argv.slice(3)

const swarm = topology(me, peers)

t.on('connection', (connection, peer) => {
  console.log(`new connection from ${peer}`)
})
