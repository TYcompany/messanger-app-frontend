import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignalMessageEnum, SignalMessageType, WebRTC } from "./webRTC";

function useWebRTC({ roomId }: { roomId: string }) {
  const [webRtc, setWebRtc] = useState(new WebRTC(roomId));
  const [onCall, setOnCall] = useState(false);

  const [isLocalMediaTrackEnabled, setIsLocalMediaTrackEnabled] = useState<{
    [key: string]: boolean;
  }>({
    video: true,
    audio: true,
  });

  const [isRemoteMediaTrackEnabled, setIsRemoteMediaTrackEnabled] = useState<{
    [key: string]: boolean;
  }>({
    video: true,
    audio: true,
  });

  const navigate = useNavigate();

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
      webRtc.navigate = navigate;
    };
    initFunction();

    return () => webRtc.onLeaveRoomButtonClick(webRtc.roomId);
  }, [webRtc, navigate]);

  const onChangeLocalVideoRef = (localVideoRef:React.MutableRefObject<null>) => {
    if (localVideoRef.current) webRtc.setLocalVideoElement(localVideoRef.current);
  };

  const onChangeRemoteVideoRef = (remoteVideoRef:React.MutableRefObject<null>) => {
    if (remoteVideoRef.current) webRtc.setRemoteVideoElement(remoteVideoRef.current);
  };

  const onClickOffer = async (roomId: string) => {
    if (isWaitingResponse.offer) {
      return;
    }
    setIsWaitingResponse({ ...isWaitingResponse, offer: true });
    await webRtc.createAndSendOffer(roomId);
    setIsWaitingResponse({ ...isWaitingResponse, offer: false });
  };

  const onClickConfirm = async (roomId: string) => {
    if (isWaitingResponse.answer) {
      return;
    }
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

  const onToggleLocalMediaTrackEnabled = (mediaType: string) => {
    webRtc.toggleLocalMediaTrack(mediaType);
    setIsLocalMediaTrackEnabled({
      ...isLocalMediaTrackEnabled,
      [mediaType]: !isLocalMediaTrackEnabled[mediaType],
    });
  };

  return {
    onChangeLocalVideoRef,
    onChangeRemoteVideoRef,
    onClickOffer,
    onClickConfirm,
    onClickReject,
    isWaitingResponse,
    onLeaveButtonClick,
    onCall,
    isLocalMediaTrackEnabled,
    isRemoteMediaTrackEnabled,
    onToggleLocalMediaTrackEnabled,
  };
}

export default useWebRTC;
