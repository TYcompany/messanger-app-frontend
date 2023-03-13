import { NavigateFunction } from "react-router-dom";
import Socket from "./socket";

export const RTC_SIGNALNAME = "rtc-signal";
export enum SignalMessageEnum {
  READY = "ready",
  OFFER = "offer",
  REJECT = "reject",
  ANSWER = "answer",
  AFTER_ANSWER = "after_answer",
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

  socket = new Socket().getSocketInstance();
  peerConnection: RTCPeerConnection | null = new RTCPeerConnection();

  setIsOpened: Function = () => {};
  roomId: string = "";
  currentRoomId: string = "";

  setSignalMessage?: React.Dispatch<React.SetStateAction<SignalMessageType>>;
  setOnCall?: React.Dispatch<React.SetStateAction<boolean>>;
  navigate?: NavigateFunction;

  offer: any;
  answer: any;

  constructor(roomId: string) {
    if (WebRTC.instance) {
      return WebRTC.instance;
    }

    WebRTC.instance = this;
    this.init(roomId);
  }

  async init(roomId: string) {
    try {
      this.roomId = roomId;
      this.socket.on(RTC_SIGNALNAME, (signalMessage: SignalMessageType) => {
        this.handleSignalMessage(signalMessage);
      });

      await this.joinRoom(roomId);

      await this.initLocalStream();

      this.peerConnection = await this.createPeerConnection();

      this.socket.emit(RTC_SIGNALNAME, "get-media-stream");
    } catch (e) {
      alert(`getUserMedia() error: ${e}`);
    }
  }

  onTrackFunction(event: RTCTrackEvent) {
    const remoteVideo = this.remoteVideo;
    this.remoteStream = event.streams[0];
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.onloadedmetadata = () => {
      remoteVideo.play();
    };
  }

  isLocalMediaTrackEnabled = (mediaType: string) => {
    const mediaTrack = this.localStream.getTracks().find((track) => track.kind === mediaType);
    return mediaTrack?.enabled ?? false;
  };

  toggleLocalMediaTrack = (mediaType: string) => {
    //"video", "audio";
    const mediaTrack = this.localStream.getTracks().find((track) => track.kind === mediaType);
    if (!mediaTrack) {
      return;
    }
    mediaTrack.enabled = !mediaTrack?.enabled;
  };

  disableLocalMediaTrack = () => {
    const tracks = this.localStream.getTracks();
    for (const track of tracks) {
      track.stop();
    }
  };

  isRemoteMediaTrackEnabled = (mediaType: string) => {
    const mediaTrack = this.remoteStream.getTracks().find((track) => track.kind === mediaType);
    return mediaTrack?.enabled;
  };

  async initLocalStream() {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    this.localStream = localStream;
    this.localVideo.srcObject = this.localStream;
  }

  async joinRoom(roomId: string = "mock-roomId") {
    this.socket.emit(RTC_SIGNALNAME, { type: SignalMessageEnum.JOIN, roomId });
  }
  async handleSignalMessage(signalMessage: SignalMessageType) {
    const { type, message, roomId } = signalMessage;

    if (type === SignalMessageEnum.CANDIDATE) {
      this.peerConnection?.addIceCandidate(message.candidate);
    }

    if (type === SignalMessageEnum.OFFER && message.offer) {
      if (!window.confirm(`got offer from ${roomId}!`)) {
        this.rejectOffer(roomId);
        return;
      }

      await this.createAndSendAnswer(roomId, message.offer);
    }

    if (type === SignalMessageEnum.ANSWER && message.answer) {
      this.addAnswer(message.answer);
    }
    if (type === SignalMessageEnum.AFTER_ANSWER) {
    }
    if (type === SignalMessageEnum.REJECT) {
      alert("rejected!");
    }

    if (type === SignalMessageEnum.LEAVE) {
      this.setOnCall?.(false);
    }
    if (type === SignalMessageEnum.JOIN) {
    }
  }

  onLeaveRoomButtonClick = (roomId: string) => {
    (this.localVideo.srcObject as MediaStream)?.getTracks().map((track) => track.stop());
    (this.remoteVideo.srcObject as MediaStream)?.getTracks().map((track) => track.stop());

    this.disableLocalMediaTrack();

    const peerConnection = this.peerConnection;
    if (peerConnection) {
      peerConnection.ontrack = null;
      peerConnection.onicecandidate = null;
      peerConnection.close();
      this.peerConnection = null;
    }

    WebRTC.instance = undefined;

    this.socket.emit(RTC_SIGNALNAME, { type: SignalMessageEnum.LEAVE, roomId: this.roomId });
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
    const peerConnection = this.peerConnection;
    peerConnection.ontrack = (event) => this.onTrackFunction(event);

    this.localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, this.localStream));

    peerConnection.onicecandidate = (event) => {
      this.socket.emit(RTC_SIGNALNAME, {
        type: SignalMessageEnum.CANDIDATE,
        roomId: this.roomId,
        message: { candidate: event.candidate },
      });
    };

    return peerConnection;
  }

  async createAndSendOffer(roomId: string) {
    const peerConnection = this.peerConnection || (await this.createPeerConnection());

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
    const peerConnection = this.peerConnection || (await this.createPeerConnection());

    this.offer = offer;

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    this.answer = answer;
    await peerConnection.setLocalDescription(answer);
    this.setOnCall?.(true);

    this.socket.emit(RTC_SIGNALNAME, {
      roomId,
      type: SignalMessageEnum.ANSWER,
      message: { answer },
    });
  }

  async addAnswer(answer: RTCSessionDescriptionInit) {
    try {
      const peerConnection = this.peerConnection || (await this.createPeerConnection());
      await peerConnection.setRemoteDescription(answer);

      this.setOnCall?.(true);
    } catch (e) {
      console.log(e);
    }
  }
}
