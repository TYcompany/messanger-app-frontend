import { useEffect, useRef, useState } from "react";
import useWebRTC from "../../socket/useWebRTC";

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
      <video ref={localVideoRef} style={{ width: "500", height: "500",background:'yellow' }}></video>
      <video ref={remoteVideoRef} style={{ width: "500", height: "500",background:'black' }}></video>
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
