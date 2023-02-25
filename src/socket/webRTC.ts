export class WebRTC {
  static instance: WebRTC | undefined;
  localStream: MediaStream | undefined;
  localVideo: HTMLVideoElement = document.createElement("video");

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

  updateCameraList(cameras: MediaDeviceInfo[]) {
    const listElement = document.querySelector("select#availableCameras") as HTMLSelectElement;

    if (!listElement) {
      return;
    }
    listElement.innerHTML = "";

    cameras
      .map((camera: MediaDeviceInfo) => {
        const cameraOption = document.createElement("option");
        cameraOption.label = camera.label;
        cameraOption.value = camera.deviceId;
        return cameraOption;
      })
      .forEach((cameraOption) => listElement.add(cameraOption));
  }

  addEventListenerOfUserDeviceChange() {
    navigator.mediaDevices.addEventListener("devicechange", async (event) => {
      const newCameraList = await this.getConnectedDevices("video");
      this.updateCameraList(newCameraList);
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

  async makeCall() {
    const localStream = this.localStream;
    if (!localStream) {
      return;
    }

    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const configuration = {};

    pc1 = new RTCPeerConnection(configuration);

    pc1.addEventListener("icecandidate", (e) => onIceCandidate(pc1, e));
    pc2 = new RTCPeerConnection(configuration);
    console.log("Created remote peer connection object pc2");

    pc2.addEventListener("icecandidate", (e) => onIceCandidate(pc2, e));
    pc1.addEventListener("iceconnectionstatechange", (e) => onIceStateChange(pc1, e));
    pc2.addEventListener("iceconnectionstatechange", (e) => onIceStateChange(pc2, e));
    pc2.addEventListener("track", gotRemoteStream);

    localStream.getTracks().forEach((track) => pc1.addTrack(track, localStream));
    console.log("Added local stream to pc1");

    try {
      console.log("pc1 createOffer start");
      const offer = await pc1.createOffer(offerOptions);
      await onCreateOfferSuccess(offer);
    } catch (e) {
      onCreateSessionDescriptionError(e);
    }
  }
  requestVideoCall() {}

  answerVideoCall() {}
}
