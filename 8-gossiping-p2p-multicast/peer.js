'use strict'
const hashToPort = require('hash-to-port')
const jsonStream = require('duplex-json-stream')
const register = require('register-multicast-dns')
const streamSet = require('stream-set')
const topology = require('fully-connected-topology')

const toAddress = (nickname) => `${nickname}.local`

// get arguments
const nickname = process.argv[2]
const myAddress = toAddress(nickname)
const peerNicknames = process.argv.slice(3)
const peerAddresses = peerNicknames.map(n => toAddress(n))
const peerIps = peerAddresses.map(addr => `localhost:${hashToPort(addr)}`)
const myIp = `localhost:${hashToPort(myAddress)}`

// register multicast .local domain
register(myAddress)

// set up swarm and connections
const swarm = topology(myIp, peerIps)
const connections = streamSet()

const mySessionId = Math.random()

// the index of the last message sent
let lastSent = 0

// keys are peers' session ID's, map to the index of the last message
// received from that session ID
let messagesSeen = {}

const broadcast = (message, nickname, sessionId, idx) => {
  connections.forEach((connection) => {
    connection.write({
      nickname: nickname,
      sessionId: sessionId,
      message: message.toString().trim(),
      idx: idx
    })
  })
}

swarm.on('connection', (connection, address) => {
  console.log(`new connection from ${address}`)

  connection = jsonStream(connection)
  connections.add(connection)

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

process.stdin.on('data', (data) => {
  lastSent += 1
  broadcast(data, nickname, mySessionId, lastSent)
})
