import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useWebRTC from "../../socket/useWebRTC";
import { currentlyChattingRoomState, currentUserState } from "../../store/store";

import { useSearchParams } from "react-router-dom";

import styled from "styled-components";
import { Button, Typography } from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

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

  const [isConnected, setIsConnected] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (remoteVideoRef.current) {
      onChangeRemoteVideoRef(remoteVideoRef);
    }
  }, [remoteVideoRef, onChangeRemoteVideoRef]);

  useEffect(() => {
    if (localVideoRef.current) {
      onChangeLocalVideoRef(localVideoRef);
    }
  }, [localVideoRef, onChangeLocalVideoRef]);

  useEffect(() => {
    setTimeout(() => setIsConnected(true), 5000);
  }, []);

  return (
    <VideoChatContainer>
      <div className="video-container">
        {isConnected && <video className={`remote-video-screen`} ref={remoteVideoRef}></video>}
        <video
          className={`local-video-screen ${isConnected && "connected"}`}
          ref={localVideoRef}
        ></video>
      </div>
      <div className="button-area">
        <div className="media-inputs">
          {isLocalMediaTrackEnabled.video ? (
            <VideocamIcon
              fontSize="large"
              onClick={() => onToggleLocalMediaTrackEnabled("video")}
            />
          ) : (
            <VideocamOffIcon
              fontSize="large"
              onClick={() => onToggleLocalMediaTrackEnabled("video")}
            />
          )}
          {isLocalMediaTrackEnabled.audio ? (
            <MicIcon fontSize="large" onClick={() => onToggleLocalMediaTrackEnabled("audio")} />
          ) : (
            <MicOffIcon fontSize="large" onClick={() => onToggleLocalMediaTrackEnabled("audio")} />
          )}
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            !isWaitingResponse.offer && onClickOffer(currentlyChattingRoom?._id);
          }}
        >
          Request video call
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Leave
        </Button>
      </div>
    </VideoChatContainer>
  );
};

const VideoChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .video-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 90vw;
    height: 90vh;
    position:relative;
    @media screen and (max-width: 750px) {
      flex-direction: column;
    }

    .local-video-screen {
      transition: 0.5s;

      width: 100%;
      height: 100%;
      background: black;
      transition: 0.5s;

      &.connected {
        position: absolute;
        left: 0;
        top: 0;
        width: 300px;
        height: 300px;
      }
    }
    .remote-video-screen {
      width: 100%;
      height: 100%;
      background: black;
    }
  }
  .button-area {
    display: flex;
    flex-direction: row;
  }
`;

export default VideoChatPage;
