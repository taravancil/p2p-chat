const net = require('net')

const server = net.createServer((connection) => {
  connection.on('data', (data) => {
    connection.write(data)
  })
  connection.on('end', () => {
    console.log('connection ended')
  })
})

server.listen('3000', () => {
  console.log('server listening on port 3000')
})
