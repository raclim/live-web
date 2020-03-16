let socket = io.connect('http://ral497.itp.io:8080/');

socket.on('connect', function() {
  console.log("Connected");
});

// Receive from any event
socket.on('othermouse', function (data) {
  console.log(data.x + " " + data.y);
  odraw(data.x,data.y);
});

var sendMouse = (xval, yval) => {
  console.log("sendmouse: " + xval + " " + yval);
  socket.emit('othermouse',{ x: xval, y: yval });
};

///////////////

let canvas;
let context;
let dot, odot;

let initCanvas = function() {
  canvas = document.getElementById('mycanvas');
  context = canvas.getContext('2d');

  context.fillStyle = 'rgba(255, 255, 255, 0.9)';
  context.fillRect(0,0,canvas.width,canvas.height);

  canvas.addEventListener('mousemove', (e) => {
    console.log('mousemove' + e.clientX + ' ' + e.clientY);

    let canvasRect = canvas.getBoundingClientRect();

    // Now calculate the mouse position values
    y = e.clientY - canvasRect.top;
    x = e.clientX - canvasRect.left;

    console.log("mousemove x:" + x + " y:" + y);

    dot = {
      x: x,
      y: y
    };

    sendMouse(x,y);
    draw(x,y);
  }, false);
};

let px = 0;
let py = 0;

let draw = function(xval,yval) {

  console.log("draw " + xval + " " + yval);
  context.beginPath();

  // This is silly but it's what we have to do to get a random hex string
  context.strokeStyle='#FF0000';

  context.moveTo(px,py);
  context.fillStyle = 'rgba(255, 0, 0, 0.5)';
  context.arc(dot.x, dot.y, 9, 0, Math.PI*2, true);
  context.fill();
  context.arc(dot.x-3, dot.y-6, 6, 0, Math.PI*2, true);
  context.globalAlpha = 0.3;
  context.arc(dot.x-6, dot.y-9, 2, 0, Math.PI*2, true);
  context.globalAlpha = 0.1;

  px = xval;
  py = yval;
  context.fillStyle = 'rgba(255, 255, 255, 0.5)';
  context.fillRect(0,0,canvas.width,canvas.height);
};

let opx = 0;
let opy = 0;

let odraw = function(xVal,yVal) {
  odot = {
    x: xVal,
    y: yVal
  }

  console.log("draw " + xVal + " " + yVal);
  context.beginPath();

  context.strokeStyle='#FF0000';

  context.moveTo(opx,opy);
  context.fillStyle = 'rgba(255, 0, 0, 0.5)';
  context.arc(odot.x, odot.y, 9, 0, Math.PI*2, true);
  context.fill();
  context.arc(odot.x-3, odot.y-6, 6, 0, Math.PI*2, true);
  context.globalAlpha = 0.3;
  context.arc(odot.x-6, odot.y-9, 2, 0, Math.PI*2, true);
  context.globalAlpha = 0.1;


  opx = xVal;
  opy = yVal;
  context.fillStyle = 'rgba(255, 255, 255, 0.5)';
  context.fillRect(0,0,canvas.width,canvas.height);
};
