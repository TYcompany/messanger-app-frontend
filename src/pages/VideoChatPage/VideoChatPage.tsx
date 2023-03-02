import { useEffect, useRef, useState } from "react";
import useWebRTC from "../../socket/useWebRTC";
import { WebRTC } from "../../socket/webRTC";
//{ roomId }: { roomId: string }
const VideoChatPage = () => {
  const {
    localVideoRef,
    remoteVideoRef,
    onClickOffer,
    onClickConfirm,
    onClickReject,
    isWaitingResponse,
  } = useWebRTC();

  const [roomId, setRoomId] = useState("");

  return (
    <div>
      <video ref={localVideoRef}></video>
      <video ref={remoteVideoRef}></video>
      <button onClick={() => !isWaitingResponse.offer && onClickOffer("mock-roomId")}>
        sendOffer
      </button>
      <button
        onClick={() => {
          !isWaitingResponse.answer && onClickConfirm("mock-roomId");
        }}
      >
        sendAnswer
      </button>
    </div>
  );
};
export default VideoChatPage;
