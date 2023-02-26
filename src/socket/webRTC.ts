import Socket from "./socket";

export class WebRTC {
  static instance: WebRTC | undefined;
  localStream: MediaStream | undefined;
  localVideo: HTMLVideoElement = document.createElement("video");
  socket = new Socket().socket;

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

  async createOffer() {
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
    const pc1 = new RTCPeerConnection(iceConfiguration);
    const localStream = await navigator.mediaDevices.getUserMedia({});
    const remoteStream=new MediaStream();

    const tracks = localStream.getTracks();
    tracks.forEach((track) => pc1.addTrack(track, localStream));
    pc1.ontrack=event=>{
        event.streams[0].getTracks().forEach(track=>remoteStream.addTrack(track))
    }

    pc1.onicecandidate=async(event)=>{
        if(event.candidate){
            console.log('icecandidate',event.candidate)
        }
    }


    const offer = await pc1.createOffer();

    await pc1.setLocalDescription(offer);


    //send message to uid
  }

  requestVideoCall() {}

  answerVideoCall() {}
}
