window.addEventListener('DOMContentLoaded', (event) => {
  const playingVideo = (currentVideo) => {
    let video = document.getElementById(currentVideo);
    video.muted = true;
    let isPlaying = video.currentTime > 0 && !video.paused && !video.ended
    && video.readyState > 2 && video.muted;
    if (!isPlaying) {
      video.play();
    }
  }

  for (let i=1; i<10; i+=1) {
    let videoNum = 'vid' + i.toString();
    console.log(videoNum);
    document.getElementById(videoNum).onload = playingVideo(videoNum);
  }

});

function approved() {
  document.getElementById('header').style.fontSize = '1.6em';
  document.getElementById('yesButton').style.display = "none";
}

function hovered(hoveredVideo) {
  console.log(hoveredVideo);
  let video = document.getElementById(hoveredVideo);
  console.log('hovered video', video);
  let randHeight = Math.random()*(300-0) + 0;
  let randWidth = Math.random()*(400-0)+0;
  if (video.muted) {
    video.muted = false;
    video.height = randHeight;
    video.Width = randWidth;
  }
  else {
    video.muted = true;
  }
}
