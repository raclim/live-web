var SerialPort = require('serialport');

//port identifier
var serialPort = new SerialPort("/dev/cu.usbmodem1411", {baudRate: 9600});

serialPort.on("open", function() {

  var socket = require('socket.io-client')('http://liveweb-new.itp.io:8080');
  socket.on('connect', function(){
    console.log("connected");
  });
  socket.on('event', function(data){
    console.log("event", data);
  });
  socket.on('disconnect', function(){
    console.log("disconnected");
  });
  socket.on('serialdata', function(data) {
    console.log(data);
    io.sockets.emit('serialdata', data);
  })
  //function is grabbing data from the serial port
  serialPort.on("data", function(data) {
    //everytime data comes in from the arduino it's going to send it to the cloud socket
    //server as serial data
    socket.emit('serialdata', data);
    console.log(data);
  });
});

//on the client javascript file
//socket.on('serialdata', function(data) {
//   console.log(data);
//   io.sockets.emit('serialdata', data);
// })

//on the frontend javascript file
//looping through incoming data
//what is an array buffer
//did not end up being used
// socket.on('serialdata', function(data) {
//   console.log(data);
//   let theactualdata = data.values();
//   for (let d of theactualdata) {
//     console.log(d);
//   }
// })
