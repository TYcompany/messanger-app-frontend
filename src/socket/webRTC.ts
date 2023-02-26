import Socket from "./socket";

interface MessageSignalType {
  type: string;
  message: {
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidate;
  };
}

export class WebRTC {
  static instance: WebRTC | undefined;
  localStream: MediaStream | undefined;
  localVideo: HTMLVideoElement = document.createElement("video");
  socket = new Socket().socket;
  peerConnection = new RTCPeerConnection();
  constructor() {
    if (WebRTC.instance) {
      return WebRTC.instance;
    }

    WebRTC.instance = this;
    this.init();
  }

  async init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

      this.localVideo.srcObject = stream;
      this.localStream = stream;
      this.socket.emit("get-media-stream", "got media stream~!");
    } catch (e) {
      alert(`getUserMedia() error: ${e}`);
    }
  }

  setLocalVideo(localVideo: HTMLVideoElement) {
    this.localVideo = localVideo;
  }

  getUserMediaApproval() {
    const openMediaDevices = async (constraints: { video: boolean; audio: boolean }) => {
      return await navigator.mediaDevices.getUserMedia(constraints);
    };

    try {
      const stream = openMediaDevices({ video: true, audio: true });
      console.log("Got MediaStream:", stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }

  async getConnectedDevices(type: string) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === type);
  }

  consoleConnectedDevice() {
    const videoCameras = this.getConnectedDevices("videoinput");
    console.log("Cameras found:", videoCameras);
  }

  addEventListenerOfUserDeviceChange() {
    navigator.mediaDevices.addEventListener("devicechange", async (event) => {
      const newCameraList = await this.getConnectedDevices("video");
      console.log(newCameraList);
    });
  }

  async openCamera(cameraId: string, minWidth: number, minHeight: number) {
    const constraints = {
      audio: { echoCancellation: true },
      video: {
        deviceId: cameraId,
        width: { min: minWidth },
        height: { min: minHeight },
      },
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  async cameraLength(cameras: MediaDeviceInfo[]) {
    if (cameras && cameras.length > 0) {
      const stream = this.openCamera(cameras[0].deviceId, 1280, 720);
    }
  }

  async playVideoFromCamera() {
    try {
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.querySelector("video#localVideo") as HTMLVideoElement;
      if (!videoElement) {
        return;
      }

      videoElement.srcObject = stream;
    } catch (error) {
      console.error("Error opening video camera.", error);
    }
  }

  async createPeerConnection() {
    const iceConfiguration = {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "turn:my-turn-server.mycompany.com:19403",
          ],
          username: "optional-username",
          credentials: "auth-token",
        },
      ],
    };
    this.peerConnection = new RTCPeerConnection(iceConfiguration);
    const localStream = await navigator.mediaDevices.getUserMedia({});
    const remoteStream = new MediaStream();
    const peerConnection = this.peerConnection;

    const tracks = localStream.getTracks();
    tracks.forEach((track) => peerConnection.addTrack(track, localStream));
    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
    };  

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log("icecandidate", event.candidate);
      }
    };
    return peerConnection;
  }

  async createOffer() {
    const peerConnection = await this.createPeerConnection();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    //send message to uid
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    const peerConnection = await this.createPeerConnection();
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    //return answer to signal server
  }
  async addAnswer(answer: RTCSessionDescriptionInit) {
    const peerConnection = this.peerConnection;
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer);
    }
  }

  async handleMessageFromPeer(messageSignal: MessageSignalType, memberId: string) {
    const { type, message } = messageSignal;

    if (type === "offer" && message.offer) {
      this.createAnswer(message.offer);
    }
    if (type === "answer" && message.answer) {
      this.addAnswer(message.answer);
    }
    if (type === "candidate" && this.peerConnection) {
      this.peerConnection.addIceCandidate(message.candidate);
    }
  }

  requestVideoCall() {}

  answerVideoCall() {}
}