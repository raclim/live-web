// We'll use a global variable to hold on to our id from PeerJS
var peer_id = null;

// I setup a peer server on a Digital Ocean instance for our use, you can use that with the following constructor:
var peer = new Peer({host: 'liveweb-new.itp.io', port: 9001, path: '/'});

// Get an ID from the PeerJS server
peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		peer_id = id;
});

peer.on('error', function(err) {
		console.log(err);
});

peer.on('call', function(incoming_call) {
		console.log("Got a call!");
		incoming_call.answer(my_stream); // Answer the call with our stream from getUserMedia
		incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
				// And attach it to a video object
				var ovideoElement = document.createElement('video');
				// ovideoElemnt.id = "something";
				ovideoElement.srcObject = remoteStream;
				//ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
				ovideoElement.setAttribute("autoplay", "true");
				ovideoElement.play();
				document.body.appendChild(ovideoElement);
		});
});

function makeCall(idToCall) {
		var call = peer.call(idToCall, my_stream);

		call.on('stream', function(remoteStream) {
				console.log("Got remote stream");
				var ovideoElement = document.createElement('video');
				ovideoElement.srcObject = remoteStream;
				// ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
				ovideoElement.setAttribute("autoplay", "true");
				ovideoElement.play();
				document.body.appendChild(ovideoElement);
		});
}

/* Get User Media */
let my_stream = null;

// Constraints - what do we want?
let constraints = { audio: false, video: true }

window.addEventListener('load', function() {
		// Prompt the user for permission, get the stream
		navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				/* Use the stream */

				// Attach to our video object
				var videoElement = document.getElementById('myvideo');
				videoElement.srcObject = stream;

				// Global for stream
				my_stream = stream;

				// Wait for the stream to load enough to play
				// videoElement.onloadedmetadata = function(e) {
				//     videoElement.play();
				// };

				videoElement.addEventListener('loadedmetadata', function(e) {
						videoElement.play();
				});

		})
		.catch(function(err) {
				/* Handle the error */
				alert(err);
		});
});
