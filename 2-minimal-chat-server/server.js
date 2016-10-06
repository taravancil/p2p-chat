'use strict'
const net = require('net')
const streamSet = require('stream-set')

const activeSockets = streamSet()

const server = net.createServer((socket) => {
  activeSockets.add(socket)
  showActiveConnections()

  socket.on('close', () => {
    activeSockets.remove(socket)
    showActiveConnections()
  })

  socket.on('data', (data) => {
    activeSockets.forEach((stream) => {
      // don't write to the socket from which the data originated
      if (socket !== stream) {
        stream.write(data)
      }
    })
  })
})

const showActiveConnections = () => {
  console.log(`${activeSockets.size} active connections`)
}

server.listen(3000, () => {
  console.log('server listening on port 3000')
})
