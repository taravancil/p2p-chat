'use strict'
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')
const topology = require('fully-connected-topology')

// get arguments
const nickname = process.argv[2]
const myAddress = process.argv[3]
const peerAddresses = process.argv.slice(4)

// set up swarm and connections
const swarm = topology(myAddress, peerAddresses)
const connections = streamSet()

const mySessionId = Math.random()

// the index of the last message sent
let lastSent = 0

// keys are peers' session ID's, map to the index of the last message
// received from that session ID
let messagesSeen = {}

swarm.on('connection', (connection, address) => {
  console.log(`new connection from ${address}`)

  connection.setMaxListeners(Infinity) // YOLO

  connections.add(connection)
  connection = jsonStream(connection)

  connection.on('data', (data) => {
    // if we haven't seen this session ID, add it to sessions
    if (messagesSeen[data.sessionId] === 'undefined') {
      messagesSeen[data.sessionId] = 0
    }

    // if we've already seen this message or it's a replay of one of our
    // messages, ignore it
    if (data.idx <= messagesSeen[data.sessionId] ||
        data.sessionId === mySessionId) return

    // update messagesSeen and forward message to all connected peers
    messagesSeen[data.sessionId] = data.idx
    broadcast(data.message, data.nickname, data.sessionId, data.idx)

    // display the message
    console.log(`${data.nickname}: ${data.message}`)
  })
})

const broadcast = (message, nickname, sessionId, idx) => {
  connections.forEach((connection) => {
    connection = jsonStream(connection)

    connection.write({
      nickname: nickname,
      sessionId: sessionId,
      message: message.toString().trim(),
      idx: idx
    })
  })
}

process.stdin.on('data', (data) => {
  lastSent += 1
  broadcast(data, nickname, mySessionId, lastSent)
})
