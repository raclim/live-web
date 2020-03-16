let video = null;
var mystream = null;
let chunks = [];
let mediaRecorder;

window.addEventListener('load', function() {
  // The video element on the page to display the webcam
  video = document.getElementById('thevideo');

  // Constraints - what do we want?
  let constraints = { audio: false, video: true };

  // Prompt the user for permission, get the stream
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

    mystream = stream;
    console.log("my stream in function: ", mystream);
    // Attach to our video object
    video.srcObject = stream;

    video.height = 300;
    video.Width = 400;
    video.onloadedmetadata = function(e) {
      video.play();
      draw();
    };
  })
  .catch(function(err) {
    alert(err);
  });
});

function draw() {

  console.log("my stream out: ", mystream);
  mediaRecorder = new MediaRecorder(mystream);

  mediaRecorder.onstop = function(e) {
    console.log("stop");
  };

  mediaRecorder.ondataavailable = function(e) {
    console.log("sending data");
    socket.emit('chunkData', e.data);
    // chunks.push(e.data);
  };

  mediaRecorder.start();

  setTimeout(function() {
    mediaRecorder.stop();
  }, 2000);

  setTimeout(draw, 3000);
};

let socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

socket.on('chunkData', function(data) {
  console.log("Got Data");
  chunks.push(data);

  let newVid = document.createElement('video');
  newVid.controls = true;
  let blob = new Blob(chunks, {'type':'video/webm'});
  let randHeight = Math.random()*(newVid.width-150)+150;
  let randWidth = Math.random()*(newVid.height-150)+150;
  console.log(randWidth, randHeight);
  newVid.width = randWidth;
  newVid.height = randHeight;
  let videoURL = window.URL.createObjectURL(blob);
  newVid.src = videoURL;

  let oVidContainer = document.getElementById('oVidContainer');
  oVidContainer.appendChild(newVid);
});
