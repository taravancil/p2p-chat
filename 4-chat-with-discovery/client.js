'use strict'
const jsonStream = require('duplex-json-stream')
const lookup = require('lookup-multicast-dns/global')
const net = require('net')

const nickname = process.argv[2]

let socket = net.connect(3000, () => {
  console.log(`connected to the server!`)
})

socket = jsonStream(socket)

socket.on('data', (data) => {
  process.stdout.write(`${data['nickname']}: ${data.message}`)
})

process.stdin.on('data', (data) => {
  socket.write({nickname: nickname, message: data.toString()})
})
