const net = require('net')

const client = net.connect({port: 3000}, () => {
  console.log('connected to the server!')
})

client.on('data', (data) => {
  console.log(data.toString().trim())
})

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    client.write(chunk)
  }
})
