'use strict'
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')
const topology = require('fully-connected-topology')

const me = process.argv[2]
const peers = process.argv.slice(3)

const swarm = topology(me, peers)
const activePeers = streamSet()

swarm.on('connection', (socket, peer) => {
  socket = jsonStream(socket)
  activePeers.add(socket)
  console.log(`new connection from ${peer}`)

  socket.on('data', (data) => {
    process.stdout.write(`${data.nickname}: ${data.message}`)
  })
})
