import Socket from "./socket";

export enum SignalMessageEnum {
  READY = "ready",
  OFFER = "offer",
  REJECT = "reject",
  ANSWER = "answer",
  CANDIDATE = "candidate",
  JOIN = "join",
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

  constructor() {
    if (WebRTC.instance) {
      return WebRTC.instance;
    }

    WebRTC.instance = this;
    this.init();
  }
  onIceCandidateFunction(event: RTCPeerConnectionIceEvent) {
    this.socket.emit(RTC_SIGNALNAME, {
      type: "candidate",
      roomId: this.roomId,
      message: { candidate: event.candidate },
    });
  }
  onTrackFunction(event: RTCTrackEvent) {
    const remoteVideo = this.remoteVideo;

    remoteVideo.srcObject = event.streams[0];
    remoteVideo.onloadedmetadata = () => {
      remoteVideo.play();
    };
  }

  async init() {
    try {
      this.setIsOpened(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      this.localStream = stream;

      this.socket.emit(RTC_SIGNALNAME, "get-media-stream");

      this.socket.on("ready", async () => {
        await this.createPeerConnection();

        const peerConnection = this.peerConnection;
        peerConnection.onicecandidate = this.onIceCandidateFunction;
        peerConnection.ontrack = this.onTrackFunction;

        const localStream = this.localStream;
        peerConnection.addTrack(localStream.getTracks()[0], localStream);
        peerConnection.addTrack(localStream.getTracks()[1], localStream);
        // peerConnection.setRemoteDescription(offer);
        // const answer = await peerConnection.createAnswer();

        // peerConnection.setLocalDescription(answer);
        // this.socket.emit("answer", answer, roomName);
      });

      //init socket listener
      this.socket.on("answer", (answer) => {
        this.peerConnection.setRemoteDescription(answer);
      });

      this.socket.on(RTC_SIGNALNAME, (signalMessage: SignalMessageType, roomId: string) =>
        this.handleSignalMessage(roomId, signalMessage)
      );

      this.socket.on("offer", async (offer) => {
        // await accept or decline;
        this.setIsOpened(true);
        // return reject event

        await this.createAndSendAnswer(this.roomId, offer);
      });
    } catch (e) {
      alert(`getUserMedia() error: ${e}`);
    }
  }

  async handleSignalMessage(roomId: string, signalMessage: SignalMessageType) {
    const { type, message } = signalMessage;

    if (type === "offer" && message.offer) {
      //check if yes or no;
      await this.createAndSendAnswer(roomId, message.offer);
    }

    if (type === "answer" && message.answer) {
      this.addAnswer(message.answer);
    }
    if (type === "candidate" && this.peerConnection) {
      this.peerConnection.addIceCandidate(message.candidate);
    }
  }

  onLeaveRoomButtonClick = () => {
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

  async createAndSendOffer(roomId: string) {
    const peerConnection = this.peerConnection;
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    this.socket.emit(RTC_SIGNALNAME, { roomId, type: "offer", message: { offer } });
  }

  async rejectOffer(roomId: string) {
    this.socket.emit(RTC_SIGNALNAME, { roomId, type: "reject", message: { roomId } });
  }

  async createAndSendAnswer(roomId: string, offer: RTCSessionDescriptionInit) {
    const peerConnection = this.peerConnection;

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    this.socket.emit(RTC_SIGNALNAME, { roomId, type: "answer", message: { answer } });
  }

  async addAnswer(answer: RTCSessionDescriptionInit) {
    const peerConnection = this.peerConnection;
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer);
    }
  }

  requestVideoCall() {}

  answerVideoCall() {}
}
