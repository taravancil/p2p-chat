# 5 - p2p

Write a program that simply connects to other peers. It should take a
port as an argument, so that each instance of the program runs a node
on that port. The network should be fully connected.

## Example

In three separate terminals run

`node peer.js localhost:3000 localhost:3001 localhost:3002`

`node peer.js localhost:3001 localhost:3000 localhost:3002`

`node peer.js localhost:3002 localhost:3000 localhost:3001`