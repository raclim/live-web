window.addEventListener('load', function() {
  // The video element on the page to display the webcam
  var video = document.getElementById('thevideo');

  // Constraints - what do we want?
  let constraints = { audio: false, video: true };

  // Prompt the user for permission, get the stream
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    // Attach to our video object
    video.srcObject = stream;
    // Wait for the stream to load enough to play
    let randHeight = Math.random()*(300-50)+50;
    let randWidth = Math.random()*(400-50)+50;
    video.height = randHeight;
    video.Width = randWidth;
    video.onloadedmetadata = function(e) {
      video.play();
      draw();
    };
  })
  .catch(function(err) {
    alert(err);
  });

  // Canvas element on the page
  var thecanvas = document.getElementById('thecanvas');
  console.log(thecanvas);
  var thecontext = thecanvas.getContext('2d');
  console.log(thecontext);
  console.log(video);
  var draw = function() {
    console.log("It should be drawing!");
    // Draw the video onto the canvas
    let randX = Math.random()*(video.width-20)+20;
    let randY =Math.random()*(video.height-20)+20;
    let randHeight = Math.random()*(300-50)+50;
    let randWidth = Math.random()*(400-50)+50;
    video.height = randHeight;
    video.Width = randWidth;
    thecontext.drawImage(video,randX,randY,video.width,video.height);

    var dataUrl = thecanvas.toDataURL();
    console.log(dataUrl);

    socket.emit('dataurl',dataUrl);

    setTimeout(draw, 4000);
  };
});


var socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

// socket.on('coordinates', function(data) {
//   document.getElementById('thediv').style.position = "absolute";
//   document.getElementById('thediv').style.top = data.x + "px";
//   document.getElementById('thediv').style.left = data.y + "px";
// });

socket.on('dataurl', function(data) {
  console.log("Got Data");
  //var theimage = document.getElementById('theimage');

  var theimage = document.createElement("img");
  theimage.src = data;
  document.body.appendChild(theimage);
  thecanvas.style.display = "none";

});
