'use strict'
require('lookup-multicast-dns/global')
const topology = require('fully-connected-topology')
const hashToPort = require('hash-to-port')
const register = require('register-multicast-dns')
const scuttleup = require('scuttleup')
const level = require('level')

const nickname = process.argv[2]
const peers = process.argv.slice(3)

const toAddress = (name) => `${name}.local:${hashToPort(name)}`

const swarm = topology(toAddress(nickname), peers.map(toAddress))

register(nickname)

let logs = scuttleup(level(`${nickname}.db`), {id: nickname})

swarm.on('connection', (connection, address) => {
  console.log(`new connection from ${address}`)
  connection.pipe(logs.createReplicationStream({live: true})).pipe(connection)
})

logs.createReadStream({live: true})
  .on('data', data => {
    if (data.peer === nickname) return
    console.log(`${data.peer}: ${data.entry.toString().trim()}`)
  })

process.stdin.on('data', data => {
  logs.append(data)
})
