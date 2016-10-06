'use strict'
require('lookup-multicast-dns/global')
const jsonStream = require('duplex-json-stream')
const net = require('net')

const nickname = process.argv[2]
const networkNickname = process.argv[3]

let socket = net.connect(3000, networkNickname, () => {
  console.log(`connected to the server!`)
})

socket = jsonStream(socket)

socket.on('data', (data) => {
  process.stdout.write(`${data['nickname']}: ${data.message}`)
})

process.stdin.on('data', (data) => {
  socket.write({nickname: nickname, message: data.toString()})
})
