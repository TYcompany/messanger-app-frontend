import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useWebRTC from "../../socket/useWebRTC";
import { currentlyChattingRoomState, currentlyChattingUserState } from "../../store/store";

import { useSearchParams } from "react-router-dom";
import { SignalMessageEnum } from "../../socket/webRTC";
import styled from "styled-components";
import { Button } from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const VideoComponent = ({
  ref,
  onToggleMediaInput,
  title,
}: {
  ref: React.MutableRefObject<null>;
  onToggleMediaInput: Function;
  title: string;
}) => {
  const [isMediaOn, setIsMediaOn] = useState<{ [key: string]: boolean }>({
    video: true,
    audio: true,
  });

  const onToggleMediaInputIcon = (name: string) => {
    onToggleMediaInput();
    setIsMediaOn((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <VideoComponentContainer>
      <div>{title}</div>
      <video className="video-screen" ref={ref}></video>
      <div className="media-inputs">
        {isMediaOn.video ? (
          <VideocamIcon fontSize="large" onClick={() => onToggleMediaInputIcon("video")} />
        ) : (
          <VideocamOffIcon fontSize="large" onClick={() => onToggleMediaInputIcon("video")} />
        )}
        {isMediaOn.audio ? (
          <MicIcon fontSize="large" onClick={() => onToggleMediaInputIcon("audio")} />
        ) : (
          <MicOffIcon fontSize="large" onClick={() => onToggleMediaInputIcon("audio")} />
        )}
      </div>
    </VideoComponentContainer>
  );
};

const VideoChatPage = () => {
  const currentlyChattingRoom = useRecoilValue(currentlyChattingRoomState);
  const currentlyChattingUser = useRecoilValue(currentlyChattingUserState);

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const roomId = searchParams.get("roomId") || "";

  const {
    localVideoRef,
    remoteVideoRef,
    onClickOffer,
    onClickConfirm,
    onClickReject,
    isWaitingResponse,
  } = useWebRTC({ roomId });

  return (
    <VideoChatContainer>
      <div>Video chat with {currentlyChattingUser?.userName}</div>
      <div className="video-container">
        <VideoComponent
          title="my-screen"
          ref={localVideoRef}
          onToggleMediaInput={() => {}}
        ></VideoComponent>
        <VideoComponent
          title="remote-screen"
          ref={remoteVideoRef}
          onToggleMediaInput={() => {}}
        ></VideoComponent>
      </div>
      <div className="button-area">
        <Button
          onClick={() => !isWaitingResponse.offer && onClickOffer(currentlyChattingRoom?._id)}
        >
          Request video call
        </Button>
      </div>
    </VideoChatContainer>
  );
};

const VideoComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .video-screen {
    width: 500px;
    height: 500px;
    background: black;
  }
  .media-inputs {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    gap: 30px;
  }
`;

const VideoChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .video-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  .button-area {
    display: flex;
    flex-direction: row;
  }
`;

export default VideoChatPage;
