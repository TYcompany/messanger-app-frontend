import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import useWebRTC from "../../socket/useWebRTC";
import { currentlyChattingRoomState, currentlyChattingUserState } from "../../store/store";

const VideoChatPage = () => {
  const currentlyChattingRoom = useRecoilValue(currentlyChattingRoomState);
  const currentlyChattingUser = useRecoilValue(currentlyChattingUserState);

  const {
    localVideoRef,
    remoteVideoRef,
    onClickOffer,
    onClickConfirm,
    onClickReject,
    isWaitingResponse,
  } = useWebRTC({ roomId: currentlyChattingRoom?._id });

  useEffect(() => {}, []);

  return (
    <div>
      <div>Video chat with {currentlyChattingUser?.userName}</div>
      <video
        ref={localVideoRef}
        style={{ width: "500", height: "500", background: "yellow" }}
      ></video>

      <video
        ref={remoteVideoRef}
        style={{ width: "500", height: "500", background: "black" }}
      ></video>
      <button onClick={() => !isWaitingResponse.offer && onClickOffer(currentlyChattingRoom?._id)}>
        sendOffer
      </button>
      <button
        onClick={() => {
          !isWaitingResponse.answer && onClickConfirm(currentlyChattingRoom?._id);
        }}
      >
        sendAnswer
      </button>
    </div>
  );
};
export default VideoChatPage;
