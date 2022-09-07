import io from "socket.io-client";

const PORT = "ws://localhost:5000/";

export default class Socket {
  static instance: Socket | undefined;
  socket = io(PORT);
  constructor() {
    if (Socket.instance) {
      return Socket.instance;
    }

    Socket.instance = this;
    this.init();
  }

  init() {
    const socket = this.socket;
    console.log('inititd')
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("exception", (msg) => {
      console.log(msg);
    });
    socket.on("disconnect", () => {});
    
  }
  getSocketInstance() {
    return this.socket;
  }
}