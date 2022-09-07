// import WebSocket from 'ws';
const WebSocket = require('ws')
// const url = "wss://192.168.219.161:8000/ws/"
const url = "wss://lightr.dk/ws/"


var ws;
var openConnection = false;

function connect() {
  try {
    ws = new WebSocket(url, {
      rejectUnauthorized: false
    });
  } catch (error) {
    return;
  }
  ws.on('open', function open() {
    openConnection = true;
    console.log("Connected established");
    ws.send('something');
  });

  ws.on('message', function message(data) {
    // console.log('received: %s', data);
  });

  // TODO: try and reconnect. create connect function that establishes websocket behaviour
  ws.on('close', function close() {
    openConnection = false;
    console.log("Disconnected");
    setTimeout(() => {
      connect();
    }, 5000)
  })
  ws.on('error', function error(code) {
    openConnection = false;
    console.log("Failed to code ", code);
    // setTimeout(() => {
    //   connect();
    // }, 5000)
  })
}
connect();


  // TODO: see if the connection is established before trying to send packet
function sendPacketToServer(content) {
  if (!openConnection) return;
  let packet = {
    timestamp: Date.now(),
    type: "dmx",
    content: content,
    sender: "dmxpi",
  }
  ws.send(JSON.stringify(packet))
  console.log("sent DMX");
}

module.exports = {
  sendPacketToServer,
  openConnection
}