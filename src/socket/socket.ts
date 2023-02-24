import io from "socket.io-client";

const PORT = process.env.REACT_APP_SOCKET_HOST_URL || "ws://localhost:5000/";

export default class Socket {
  static instance: Socket | undefined;
  socket = io(PORT + "/chatting");
  constructor() {
    if (Socket.instance) {
      return Socket.instance;
    }

    Socket.instance = this;
    this.init();
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

  requestVideoCall() {}

  answerVideoCall() {}

  init() {
    const socket = this.socket;
    console.log("inititd");

    socket.on("connect", () => {
      console.log("connected socket server");
    });
    socket.on("exception", (msg) => {
      console.log(msg);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    socket.on("connection_error", (err: any) => {
      console.log(err);
    });
    socket.on("error", (err: any) => {
      console.log("Error: " + err);
    });
  }

  getSocketInstance() {
    return this.socket;
  }
}
