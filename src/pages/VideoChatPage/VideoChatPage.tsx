import { useEffect, useRef } from "react";
import { WebRTC } from "../../socket/webRTC";

const VideoChatPage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const webRtc = new WebRTC();

    const initFunction = async () => {
      await webRtc.init();
      if (videoRef.current) webRtc.setLocalVideoElement(videoRef.current);
    };
    initFunction();
  }, [videoRef]);

  return (
    <div>
      <video ref={videoRef}></video>
    </div>
  );
};
export default VideoChatPage;
