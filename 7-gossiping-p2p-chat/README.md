# 7 - Gossiping p2p chat

Not all p2p networks are fully connected. So if any node doesn't
explicitly connect to the other, they won't be able to
communicate. Find a way to deal with that!

For example, if 3 nodes are connected like so:

`eduardo <-> mafintosh <-> watson`

eduardo and watson should still be able to communicate via mafintosh.

## Example

Run

`node peer.js your-name localhost:3000 localhost:3001`

`node peer.js friend-1 localhost:3001 localhost:3001`

`node peer.js friend-2 localhost:3002`

and chat with your imaginary friends!