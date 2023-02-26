let localVideo = document.createElement("video");
let remoteVideo = document.createElement("video");
let localStream;

const getUserMedia = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  gotStream(stream);
};

function gotStream(stream: MediaStream) {
  console.log("Adding local stream");
  localStream = stream;
  localVideo.srcObject = stream;
  socket.emit("get-media-stream", "got media stream~!");
  createPeerConnection();
}

function createPeerConnection() {
  try {
    const pc = new RTCPeerConnection();

    const handleIceCandidate = (event) => {
      console.log("iceCandidateEvent", event);
      if (event.candidate) {
        this.socket.emit("on-ice-candidate", {
          type: "candidate",
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      }
    };
    pc.onicecandidate = handleIceCandidate;
    // pc.onaddstream =
    // remoteStream = event.stream;
    // remoteVideo.srcObject = remoteStream;
    //pc.addStream(localStream);
  } catch (e) {
    alert("connot create RTCPeerConnection object");
    return;
  }
}

socket.on("message", (message) => {
  console.log("Client received message :", message);
  if (message === "got user media") {
    createPeerConnection();
  } else if (message.type === "offer") {
    if (!isInitiator && !isStarted) {
      maybeStart();
    }
    pc.setRemoteDescription(new RTCSessionDescription(message));
    doAnswer();
  } else if (message.type === "answer" && isStarted) {
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === "candidate" && isStarted) {
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate,
    });

    pc.addIceCandidate(candidate);
  }
});
