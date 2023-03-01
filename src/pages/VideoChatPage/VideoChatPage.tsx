import { useEffect, useRef, useState } from "react";
import useWebRTC from "../../socket/useWebRTC";
import { WebRTC } from "../../socket/webRTC";

const VideoChatPage = ({ roomId }: { roomId: string }) => {
  const {
    localVideoRef,
    remoteVideoRef,
    onClickOffer,
    onClickConfirm,
    onClickReject,
    isWaitingResponse,
  } = useWebRTC();
  
  return (
    <div>
      <video ref={localVideoRef}></video>
      <video ref={remoteVideoRef}></video>
    
    </div>
  );
};
export default VideoChatPage;
