import { Receiver } from 'sacn';
// import { sendPacketToServer } from './wsclient.js';

const sACN = new Receiver({
  universes: [1, 2],
  iface: "169.254.30.194" // LundBook IP
  // iface: "169.254.95.10" // Pi IP
  // see table 1 below for all options
});
console.log("Listening for sACN");

var lastUpdate = 0;
var latestUpdate = 0;
// var latestUpdates = new Array();

sACN.on('packet', (packet) => {
  // console.log('got dmx data:', packet.payload);
  console.clear();
  let payloadSlice = packet.payloadAsBuffer?.slice(478, 479);
  if(!payloadSlice) return;
  for (const slice of payloadSlice) {
    console.log(slice.toString(10));
  }
  console.log()
  let val = packet.payload["479"]
  console.log("val", val);
  let mapval = map(val,0,100,0,255)
  console.log("map", Math.round(mapval));

  var currentTime = Date.now();
  let timeSinceLastUpdate = currentTime - lastUpdate;
  console.log("Time since last update", timeSinceLastUpdate);
  if(lastUpdate != 0) {
    if (timeSinceLastUpdate > latestUpdate) {
      latestUpdate = timeSinceLastUpdate;
    }
  }
  lastUpdate = currentTime;
  console.log("Latest update recorded:", latestUpdate);
  // console.log(packet);
  // see table 2 below for all packet properties
});

sACN.on('PacketCorruption', (err) => {
  // trigged if a corrupted packet is received
});

sACN.on('PacketOutOfOrder', (err) => {
  // trigged if a packet is received out of order
});

/* advanced usage below */

sACN.on('error', (err) => {
  // trigged if there is an internal error (e.g. the supplied `iface` does not exist)
});

// start listening to a new universe (universe 3 in this example)
// sACN.addUniverse(3);

// stop listening to a universe 1
// sACN.removeUniverse(1);

// close all connections; terminate the receiver
// setTimeout(() => {
//   sACN.close();
// }, 60000);

// sACN.universes; // is a list of the universes being listened to



// Functions for mapping values
export function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number) {
  const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

function clamp(input: number, min: number, max: number) {
  return input < min ? min : input > max ? max : input;
}