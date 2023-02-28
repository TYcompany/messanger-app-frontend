import { useEffect, useRef, useState } from "react";
import { WebRTC } from "../../socket/webRTC";

const VideoChatPage = () => {
  const videoRef = useRef(null);
  //videoPopup;

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const webRtc = new WebRTC();

    const initFunction = async () => {
      webRtc.setIsOpened = setIsOpened;
      await webRtc.init();
      if (videoRef.current) webRtc.setLocalVideoElement(videoRef.current);
    };
    initFunction();
  }, [videoRef]);

  return <div>{isOpened && <video ref={videoRef}></video>}</div>;
};
export default VideoChatPage;
