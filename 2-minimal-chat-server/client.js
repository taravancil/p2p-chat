'use strict'
const net = require('net')

const socket = net.connect(3000, () => {
  console.log('connected to the server!')
})

socket.on('data', (data) => {
  process.stdout.write(data)
})

process.stdin.on('data', (data) => {
  socket.write(data)
})
