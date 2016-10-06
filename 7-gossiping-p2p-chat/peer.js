'use strict'
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')
const topology = require('fully-connected-topology')

const nickname = process.argv[2]
const me = process.argv[3]
const peerAddresses = process.argv.slice(4)

const swarm = topology(me, peerAddresses)
const activePeers = streamSet()

// The index of the last message the peer has seen and forwarded to
// its peers
let lastMessageSeen = 0

swarm.on('connection', (connection, peer) => {
  activePeers.add(connection)
  console.log(`new connection from ${peer}`)

  connection = jsonStream(connection)
  connection.on('data', (data) => {
    // If the message ID > lastMessageSeen
    // Increment the index and forward to all peers
    // Else ignore the message
    if (m)
    console.log(`${data.nickname}: ${data.message}`)
  })
})

const broadcast = (message) => {
  swarm.connections.forEach((connection) => {
    const message = message.toString().trim()

    connection = jsonStream(connection)
    connection.write({
      nickname: nickname,
      message: message
    })
  })
}

process.stdin.on('data', (data) => {
  broadcast(data)
})
