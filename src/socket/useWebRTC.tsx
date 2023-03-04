import { useEffect, useRef, useState } from "react";
import { SignalMessageEnum, SignalMessageType, WebRTC } from "./webRTC";

function useWebRTC({ roomId }: { roomId: string }) {
  const [webRtc, setWebRtc] = useState(new WebRTC(roomId));
  const [onCall, setOnCall] = useState(false);

  const [signalMessage, setSignalMessage] = useState<SignalMessageType>({
    type: SignalMessageEnum.READY,
    roomId: "",
    message: {},
  });

  const [isWaitingResponse, setIsWaitingResponse] = useState({
    offer: false,
    answer: false,
  });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const initFunction = async () => {
      webRtc.setIsOpened = setIsOpened;
      webRtc.setSignalMessage = setSignalMessage;
      webRtc.setOnCall = setOnCall;

      if (localVideoRef.current) webRtc.setLocalVideoElement(localVideoRef.current);
      if (remoteVideoRef.current) webRtc.setRemoteVideoElement(remoteVideoRef.current);
    };
    initFunction();

    return () => webRtc.onLeaveRoomButtonClick(webRtc.roomId);
  }, [localVideoRef, remoteVideoRef, webRtc]);

  const handleSignalMessage = async () => {};

  const onClickOffer = async (roomId: string) => {
    setIsWaitingResponse({ ...isWaitingResponse, offer: true });
    await webRtc.createAndSendOffer(roomId);
    setIsWaitingResponse({ ...isWaitingResponse, offer: false });
  };

  const onClickConfirm = async (roomId: string) => {
    setIsWaitingResponse({ ...isWaitingResponse, answer: true });
    if (webRtc.peerConnection.localDescription) {
      await webRtc.createAndSendAnswer(roomId, webRtc.peerConnection.localDescription);
    } else {
      throw new Error("no local description");
    }
    setIsWaitingResponse({ ...isWaitingResponse, answer: false });
  };

  const onClickReject = async (roomId: string) => {
    webRtc.rejectOffer(roomId);
  };

  const onLeaveButtonClick = () => {
    webRtc.onLeaveRoomButtonClick(webRtc.roomId);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    onClickOffer,
    onClickConfirm,
    onClickReject,
    isWaitingResponse,
    onLeaveButtonClick,
    onCall,
  };
}

export default useWebRTC;
