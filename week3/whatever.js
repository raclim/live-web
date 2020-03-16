// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(8080);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {

		console.log("We have a new client: " + socket.id);

		// When this user "send" from clientside javascript, we get a "message"
		// client side: socket.send("the message");  or socket.emit('message', "the message");
		socket.on('message',
			// Run this function when a message is sent
			function (data) {
				console.log("message: " + data);

				// Call "broadcast" to send it to all clients (except sender), this is equal to
				// socket.broadcast.emit('message', data);
				socket.broadcast.send(data);

				// To all clients, on io.sockets instead
				// io.sockets.emit('message', "this goes to everyone");
			}
		);

		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('otherevent', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'otherevent' " + data);
		});


		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}
);
