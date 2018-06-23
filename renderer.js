const { desktopCapturer } = require("electron");

desktopCapturer.getSources(
  { types: ["window", "screen"] },
  (error, sources) => {
    if (error) throw error;
    console.log('sources', sources);
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].name === "Screen 2") {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: sources[i].id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
              }
            }
          })
          .then(stream => gotMedia(stream))
          .catch(e => handleError(e));
        return;
      }
    }
  }
);

function handleStream(stream) {
  const video = document.querySelector("video");
  video.srcObject = stream;
  video.onloadedmetadata = e => video.play();
}

function handleError(e) {
  console.log(e);
}

var Peer = require('simple-peer')
var peer1 = new Peer({ initiator: true})
var peer2 = new Peer()

peer1.on('signal', function (data) {
  peer2.signal(data)
})

peer2.on('signal', function (data) {
  peer1.signal(data)
})

peer2.on('stream', function (stream) {
  const video = document.querySelector("video");
  video.srcObject = stream;
  video.onloadedmetadata = e => video.play();
})

peer2.on('data', function (stream) {
  const video = document.querySelector("video");
  video.srcObject = stream;
  video.onloadedmetadata = e => video.play();
})

function gotMedia (stream) {
  console.log('stream', stream);
  if (peer1) {
    stream.getTracks().forEach(track => peer1.addTrack(track, stream));
  }
}

