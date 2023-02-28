import { useEffect } from "react";
import { WebRTC } from "../../socket/webRTC";

const VideoChatPage = () => {
  useEffect(() => {
    const webRtc = new WebRTC();
  }, []);
  return <div></div>;
};
export default VideoChatPage;
