var https = require('https');
var fs = require('fs'); // Using the filesystem module
var url =  require('url');

var options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

function handleIt(req, res) {
	var parsedUrl = url.parse(req.url);

	var path = parsedUrl.pathname;
	if (path == "/") {
		path = "index.html";
	}

	fs.readFile(__dirname + path,

		// Callback function for reading
		function (err, fileContents) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(fileContents);
  		}
  	);

	// Send a log message to the console
	console.log("Got a request " + req.url);
}

var httpServer = https.createServer(options, handleIt);
httpServer.listen(8080);


let numUsers = 0;
let users = [];
let userPositions = [];

let adminSocket = null;


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

users[0] = 'mainGuy';
userPositions[0] = {
  x: 50,
  y: 200
};

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("We have a new client: " + socket.id);

    socket.on('newuser', function(data) {
      numUsers++;
      users.push(socket.id);
      console.log('user list: ' + users);
    });

    socket.on('spawnLocation', function(spawnData) {
      console.log('socket wanna spawn:', socket.id);
      for (let i=0; i <= users.length; i+=1) {
        if (users[i] == socket.id) {
          userPositions[i] = {
            x: spawnData.x,
            y: spawnData.y
          }
        }
      }
      console.log('testX: ' + userPositions[0].x);
      io.emit('spawnUsers', userPositions);
    });

    socket.on('newPosition', function(newPosition) {
      console.log('newPosition: ', newPosition);
      for (let i=0; i <= users.length; i+=1) {
        if (users[i] == socket.id) {
          userPositions[i].y = newPosition;
          console.log('position changed: ', userPositions[i].y);
        }
      }
      io.emit('newDudePosition', userPositions);
    });

    socket.on('mainMove', function(moveValue) {
      var shouldIMove = true;
      for(let i=1; i<users.length; i+=1) {
        console.log('calculating main move');
        let a = Math.abs(userPositions[i].x - userPositions[0].x);
        let b = Math.abs(userPositions[i].y - userPositions[0].y);
        let c = Math.sqrt(a*a + b*b);
        console.log('distance: ', c);
        if(c < 45) {
          userPositions[0].x += 0;
          console.log("SHOULDNT");
          shouldIMove = false;
          break;
        }
      }
      if (shouldIMove) {
          userPositions[0].x += moveValue;
          console.log('mainDudeMoving: ', userPositions[0]);
          io.emit('movingTheMain', userPositions);
      }
    });

    socket.on('serialdata', function(data) {
        console.log("Data from local client: ", data);
        io.emit('serialdata', data);
    });

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      numUsers--;
      for (let i=0; i <= users.length; i+=1) {
        console.log('listing: ', users[i]);
        if (users[i] == socket.id) {
          io.emit('deletePeer', userPositions);
          console.log('deleting', users[i]);
          users.splice(i,1);
          userPositions.splice(i,1);
        }
      }
      console.log('new user list: ', users);
    });
  });
