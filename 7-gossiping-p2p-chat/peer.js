'use strict'
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')
const topology = require('fully-connected-topology')

const nickname = process.argv[2]
const me = process.argv[3]
const peerAddresses = process.argv.slice(4)

const swarm = topology(me, peerAddresses)
const activePeers = streamSet()

swarm.on('connection', (connection, peer) => {
  activePeers.add(connection)
  console.log(`new connection from ${peer}`)

  connection = jsonStream(connection)
  connection.on('data', (data) => {
    console.log(`${data.nickname}: ${data.message}`)
  })
})

const broadcast = (message) => {
  swarm.connections.forEach((connection) => {
    connection = jsonStream(connection)
    connection.write({nickname: nickname, message: message.toString().trim()})
  })
}

process.stdin.on('data', (data) => {
  broadcast(data)
})
