'use strict'

const dmxlib = require('dmxnet');
const dmxnet = new dmxlib.dmxnet();

const { Timer } = require('./Timer');

const client = require("./nywsclient").client
// var webSocket = new _WebsocketClient(`wss://tmaps.xyz/`)
// var websocket = require()
// const wsc = require('./wsClient').WebsocketClient.getInstance(); // Get the websocket instance.
// console.log(require('./wsClient').getInstance())
// require('./wsClient').getInstance()
// var wsc = require('./nywsclient.js').WebsocketClient.getInstance(); // Get the websocket instance.
// console.log(wsc)
// console.log(wsc);
var receiverOptions = {
  subnet: 0, //Destination subnet, default 0
  universe: 1, //Destination universe, default 0
  net: 0, //Destination net, default 0
}

var receiver = dmxnet.newReceiver(receiverOptions);


// What channels to listen to
var cueListChannel = 0;
var cueChannel = 1;
var lastCue;
var lastList;

// var lastData = [];
// var channels = [0,1]

receiver.on('data', function (data) {
  // var interestingData = []
  // channels.forEach(channel => {
  //   interestingData.push(data[channel])
  // })

  // if (JSON.stringify(lastData) == JSON.stringify(interestingData)) {
  //   // We only want to do something if we received new data on the channels we are looking at
  //   return;
  // }
  // else {
  //   console.log(interestingData)
  //   // console.log("Channel: " + `${i + 1}` + " Value: " + data[i])
  //   lastData = interestingData;
  // }

  if (data[cueListChannel] === lastList && data[cueChannel] === lastCue) return;
  if(data[cueListChannel] === 0 || data[cueChannel] === 0) return;
    // We only want to do something if we received new data on the channels we are looking at
    let cuelist = data[0];
    let cue = data[1];
    // console.log("CueList: " + data[cueListChannel])
    // console.log("Cue: " + data[cueChannel])
    console.log(`CueList: ${cuelist}, cue: ${cue}`)
    // console.log(" ")
    lastCue = data[cueChannel]
    lastList = data[cueListChannel]
    let cuePacket = Array.from([cuelist, cue])
    Timer.timeStart();
    sendPacket(cuePacket)
});

function sendPacket(packet) {
  Timer.timeStart()
  client.conn?.send(JSON.stringify(packet))
}

function sendMockData() {
  console.log("Starting sending mock data to tmaps.xyz");
  setInterval(() => {
    sendPacket(Array.from([1,1]))
  }, 1000);
}

const myArgs = process.argv.slice(2);
switch (myArgs[0]) {
  case "mock":
    sendMockData()
    break;

  default:
    break;
}

