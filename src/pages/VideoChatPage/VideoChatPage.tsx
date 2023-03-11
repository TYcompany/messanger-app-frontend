import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useWebRTC from "../../socket/useWebRTC";
import {
  currentlyChattingRoomState,
  currentlyChattingUserState,
  currentUserState,
} from "../../store/store";

import { useSearchParams } from "react-router-dom";
import { SignalMessageEnum } from "../../socket/webRTC";
import styled from "styled-components";
import { Button, Typography } from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const VideoComponent = ({
  userName,
  onToggleMediaInput,
  isMediaTrackEnabled,
  onChangeVideoRef,
  isLocal,
}: {
  userName: string;
  onToggleMediaInput: Function;

  isMediaTrackEnabled: { [key: string]: boolean };
  onChangeVideoRef: Function;
  isLocal: boolean;
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      onChangeVideoRef(videoRef);
    }
  }, [videoRef, onChangeVideoRef]);

  const onToggleMediaInputIcon = (name: string) => {
    onToggleMediaInput(name);
  };

  return (
    <VideoComponentContainer>
      <Typography fontSize={20} fontWeight={"medium"}>
        {userName}
      </Typography>
      <video className={`video-screen`} ref={videoRef}></video>
      <div className="media-inputs">
        {isMediaTrackEnabled.video ? (
          <VideocamIcon fontSize="large" onClick={() => onToggleMediaInputIcon("video")} />
        ) : (
          <VideocamOffIcon fontSize="large" onClick={() => onToggleMediaInputIcon("video")} />
        )}
        {isMediaTrackEnabled.audio ? (
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
  const currentUser = useRecoilValue(currentUserState);

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const roomId = searchParams.get("roomId") || "";
  const userName = searchParams.get("userName") || "";
  const {
    onChangeLocalVideoRef,
    onChangeRemoteVideoRef,
    onClickOffer,
    onClickConfirm,
    onClickReject,
    isWaitingResponse,
    isLocalMediaTrackEnabled,
    isRemoteMediaTrackEnabled,
    onToggleLocalMediaTrackEnabled,
  } = useWebRTC({ roomId });

  return (
    <VideoChatContainer>
      <Typography fontSize={30} fontWeight={"bold"}>
        Video chat with {userName}
      </Typography>
      <div className="video-container">
        <VideoComponent
          userName={currentUser.userName}
          isMediaTrackEnabled={isLocalMediaTrackEnabled}
          onToggleMediaInput={onToggleLocalMediaTrackEnabled}
          onChangeVideoRef={onChangeLocalVideoRef}
          isLocal={true}
        ></VideoComponent>
        <VideoComponent
          userName={userName}
          isMediaTrackEnabled={isRemoteMediaTrackEnabled}
          onToggleMediaInput={() => {}}
          onChangeVideoRef={onChangeRemoteVideoRef}
          isLocal={false}
        ></VideoComponent>
      </div>
      <div className="button-area">
        <Button
          onClick={(e) => {
            e.preventDefault();
            !isWaitingResponse.offer && onClickOffer(currentlyChattingRoom?._id);
          }}
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
    width: 640px;
    height: 480px;
    background: black;
    transition: 0.5s;
  }

  .media-inputs {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    gap: 30px;
  }

  @media screen and (max-width: 750px) {
    .video-screen {
      width: 90%;
      height:100%;
    }
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

    @media screen and (max-width: 750px) {
      flex-direction: column;
    }
  }
  .button-area {
    display: flex;
    flex-direction: row;
  }
`;

export default VideoChatPage;
