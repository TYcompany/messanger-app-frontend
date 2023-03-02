import Socket from "./socket";

export enum SignalMessageEnum {
  READY = "ready",
  OFFER = "offer",
  REJECT = "reject",
  ANSWER = "answer",
  CANDIDATE = "candidate",
  JOIN = "join",
  LEAVE = "leave",
}

export interface SignalMessageType {
  type: SignalMessageEnum;
  roomId: string;
  message: {
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidate;
  };
}

const RTC_SIGNALNAME = "rtc-signal";
const iceConfiguration = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
    // {
    //   urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    // },
  ],
};

export class WebRTC {
  static instance: WebRTC | undefined;
  localStream: MediaStream = new MediaStream();
  localVideo: HTMLVideoElement = document.createElement("video");
  remoteStream: MediaStream = new MediaStream();
  remoteVideo: HTMLVideoElement = document.createElement("video");

  socket = new Socket().socket;
  peerConnection = new RTCPeerConnection();

  setIsOpened: Function = () => {};
  roomId: string = "";
  currentRoomId: string = "";

  setSignalMessage?: React.Dispatch<React.SetStateAction<SignalMessageType>>;
  setOnCall?: React.Dispatch<React.SetStateAction<boolean>>;

  constructor() {
    if (WebRTC.instance) {
      return WebRTC.instance;
    }

    WebRTC.instance = this;
    this.init();
  }
  onIceCandidateFunction(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      this.peerConnection.addIceCandidate(event.candidate);
    }
    this.socket.emit(RTC_SIGNALNAME, {
      type: "candidate",
      roomId: this.roomId,
      message: { candidate: event.candidate },
    });
  }
  onTrackFunction(event: RTCTrackEvent) {
    const remoteVideo = this.remoteVideo;
    console.log(event);
    console.log(remoteVideo);

    if (!remoteVideo) {
      return;
    }
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.onloadedmetadata = () => {
      remoteVideo.play();
    };
  }

  async init() {
    try {
      this.setIsOpened(true);
      const peerConnection = await this.createPeerConnection();
      this.peerConnection = peerConnection;

      this.socket.emit(RTC_SIGNALNAME, "get-media-stream");

      // this.socket.on("ready", async () => {
      //   await this.setRemoteStream();
      // });

      this.socket.on(RTC_SIGNALNAME, (signalMessage: SignalMessageType) => {
        console.log(signalMessage);
        this.handleSignalMessage(signalMessage);
      });

      this.joinRoom();
    } catch (e) {
      alert(`getUserMedia() error: ${e}`);
    }
  }
  async joinRoom(roomId: string = "mock-roomId") {
    this.socket.emit(RTC_SIGNALNAME, { type: SignalMessageEnum.JOIN, roomId });
  }
  async handleSignalMessage(signalMessage: SignalMessageType) {
    const { type, message, roomId } = signalMessage;

    if (type === SignalMessageEnum.CANDIDATE && this.peerConnection) {
      this.peerConnection.addIceCandidate(message.candidate);
    }
    if (type === SignalMessageEnum.OFFER && message.offer) {
      //check if yes or no;
      // await accept or decline;
      //this.setIsOpened(true);
      // return reject event

      await this.createAndSendAnswer(roomId, message.offer);
    }

    if (type === SignalMessageEnum.ANSWER && message.answer) {
      this.addAnswer(message.answer);
      //startVideoChat;
    }
    if (type === SignalMessageEnum.REJECT) {
      alert("rejected!");
    }

    if (type === SignalMessageEnum.LEAVE) {
      this.onLeaveRoomButtonClick(roomId);
    }
    if (type === SignalMessageEnum.JOIN) {
    }
  }

  onLeaveRoomButtonClick = (roomId: string) => {
    this.socket.emit("leave", this.roomId);
    (this.localVideo.srcObject as MediaStream)?.getTracks().map((track) => track.stop());
    (this.remoteVideo.srcObject as MediaStream)?.getTracks().map((track) => track.stop());

    const peerConnection = this.peerConnection;
    if (peerConnection) {
      peerConnection.ontrack = null;
      peerConnection.onicecandidate = null;
      peerConnection.close();
      this.peerConnection = new RTCPeerConnection();
    }
  };

  setLocalVideoElement = (localVideo: HTMLVideoElement) => {
    this.localVideo = localVideo;

    this.localVideo.srcObject = this.localStream;
    this.localVideo.onloadedmetadata = () => {
      this.localVideo.play();
    };
  };

  setRemoteVideoElement = (remoteVideo: HTMLVideoElement) => {
    this.remoteVideo = remoteVideo;

    this.remoteVideo.srcObject = this.remoteStream;
    this.remoteVideo.onloadedmetadata = () => {
      this.remoteVideo.play();
    };
   
  };

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
    this.peerConnection = new RTCPeerConnection(iceConfiguration);
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    this.localStream = localStream;
    this.localVideo.srcObject = this.localStream;

    const peerConnection = this.peerConnection;

    const tracks = localStream.getTracks();
    tracks.forEach((track) => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = this.onTrackFunction;
    // {
    //   event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
    // };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
      }
    };

    return peerConnection;
  }

  async createAndSendOffer(roomId: string) {
    const peerConnection = this.peerConnection;
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    this.socket.emit(RTC_SIGNALNAME, { roomId, type: SignalMessageEnum.OFFER, message: { offer } });
  }

  async rejectOffer(roomId: string) {
    this.socket.emit(RTC_SIGNALNAME, {
      roomId,
      type: SignalMessageEnum.REJECT,
      message: { roomId },
    });
  }

  async createAndSendAnswer(roomId: string, offer: RTCSessionDescriptionInit) {
    if (!window.confirm("got video chat request!")) {
      this.rejectOffer(roomId);

      return;
    }

    const peerConnection = this.peerConnection;

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);

    this.socket.emit(RTC_SIGNALNAME, {
      roomId,
      type: SignalMessageEnum.ANSWER,
      message: { answer },
    });
  }

  async addAnswer(answer: RTCSessionDescriptionInit) {
    try {
      this.peerConnection.setRemoteDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }
}
