import io from "socket.io-client";

const PORT = process.env.REACT_APP_SOCKET_HOST_URL || "ws://localhost:5000/";

export default class Socket {
  static instance: Socket | undefined;
  socket = io(PORT, {
    withCredentials: true,
  });
  constructor() {
    if (Socket.instance) {
      return Socket.instance;
    }

    Socket.instance = this;
    this.init();
  }

  init() {
    const socket = this.socket;
    console.log("inititd");

    socket.on("connect", () => {
      console.log("connected");
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
