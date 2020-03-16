let socket = io();

socket.on('connect', function(){
  console.log("Connected");
  socket.emit('newuser', socket.id);
});

let userWidth, userHeight, myID;
let mainX, mainY;
let heart;
let inColor = ['#A152E6','#E652C4','#5253E6','#52C8E6',
'#52E6AD','#529DE6','#BF52E6', '#52E6CB'];

function preload() {
  heart = loadImage('heart.png');
}

function setup() {
  imageMode(CENTER);
  textAlign(CENTER);
  let canvas = createCanvas(1100, 575);
  canvas.id('mycanvas');
  textSize(30);
  background(252, 245, 245);
  noStroke();

  //drawing me
  userWidth = random(width);
  userHeight = random(height);
  userData = {
    x: userWidth,
    y: userHeight
  }
  console.log('meData', userData);
  socket.emit('spawnLocation', userData);

  //drawing other dudes
  socket.on('spawnUsers', function(spawnList) {
    console.log("userList: ", spawnList);
    mainSprite = image(heart, spawnList[0].x, spawnList[0].y, 30,30);
    for(let i=1; i< spawnList.length; i+=1) {
      fill(random(inColor));
      rect(spawnList[i].x, spawnList[i].y, 30,30, 5);
    }
  });

  //incoming serial data
  socket.on('serialdata', function(data) {
    console.log('serialData', data);
    if (data>600) {
      let moveValue = (data, 600, 900, 0, 50);
      socket.emit('mainMove', moveValue);
      console.log('goingRight:', moveValue);
    }
  });

  //drawing other dudes when they move
  socket.on('newDudePosition', function(newSpawns) {
    background(252, 245, 245);
    console.log('creating new positions');
    mainSprite = image(heart, newSpawns[0].x, newSpawns[0].y,30,30);
    if(newSpawns[0].x >= width) {
      textSize(50);
      fill(255, 100, 100);
      text('MADE IT!', width/2, height/2);
    }
    for(let i=1; i< newSpawns.length; i+=1) {
      fill(random(inColor));
      rect(newSpawns[i].x, newSpawns[i].y, 30,30,5);
    }
  });

  //drawing when the main guy moves
  socket.on('movingTheMain', function(newSpawns) {
    background(252, 245, 245);
    console.log('creating new positions');
    mainSprite = image(heart, newSpawns[0].x, newSpawns[0].y,30,30);
    if(newSpawns[0].x >= width) {
      textSize(50);
      fill(255, 100, 100);
      text('MADE IT!', width/2, height/2);
    }
    for(let i=1; i< newSpawns.length; i+=1) {
      fill(random(inColor));
      rect(newSpawns[i].x, newSpawns[i].y, 30,30,5);
    }
  });

  //deleting a disconnected dude
  socket.on('deletePeer', function(byeSpawn) {
    background(252, 245, 245);
    console.log('deleting Peer');
    mainSprite = image(heart, byeSpawn[0].x, byeSpawn[0].y,30,30);
    for(let i=1; i< byeSpawn.length; i+=1) {
      fill(random(inColor));
      rect(byeSpawn[i].x, byeSpawn[i].y, 30,30,5);
    }
  });
}


function keyPressed() {
  if (keyCode == UP_ARROW) {
    userHeight -= 50;
    console.log('goingUp', userHeight);
    socket.emit('newPosition', userHeight);
  } else if (keyCode == DOWN_ARROW) {
    userHeight += 50;
    console.log('goingDown', userHeight);
    socket.emit('newPosition', userHeight);
  }
  // else if (keyCode == RIGHT_ARROW) {
  //   socket.emit('mainMove');
  //   console.log('goingRight');
  // }
}
