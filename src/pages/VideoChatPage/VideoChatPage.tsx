import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useWebRTC from "../../socket/useWebRTC";
import { currentlyChattingRoomState, currentUserState } from "../../store/store";

import { useNavigate, useSearchParams } from "react-router-dom";

import styled from "styled-components";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import PhoneIcon from "@mui/icons-material/Phone";

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
    onToggleLocalMediaTrackEnabled,
    onLeaveButtonClick,
    onCall,
  } = useWebRTC({ roomId });
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    onChangeRemoteVideoRef(remoteVideoRef);
    onChangeLocalVideoRef(localVideoRef);
  }, [remoteVideoRef, onChangeRemoteVideoRef,localVideoRef, onChangeLocalVideoRef]);

  useEffect(() => {
    return onLeaveButtonClick();
  }, []);

  return (
    <VideoChatContainer>
      <div className="video-container">
        <video
          className={`remote-video-screen ${onCall && "on-call"}`}
          ref={remoteVideoRef}
        ></video>
        <video className={`local-video-screen ${onCall && "on-call"}`} ref={localVideoRef}></video>
      </div>
      <div className="button-area">
        {isLocalMediaTrackEnabled.video ? (
          <VideocamIcon
            className="button"
            onClick={() => onToggleLocalMediaTrackEnabled("video")}
          />
        ) : (
          <VideocamOffIcon
            className="button"
            fontSize="large"
            onClick={() => onToggleLocalMediaTrackEnabled("video")}
          />
        )}
        {isLocalMediaTrackEnabled.audio ? (
          <MicIcon className="button" onClick={() => onToggleLocalMediaTrackEnabled("audio")} />
        ) : (
          <MicOffIcon className="button" onClick={() => onToggleLocalMediaTrackEnabled("audio")} />
        )}
        <PhoneIcon
          className="button call"
          onClick={(e) => {
            e.preventDefault();
            !isWaitingResponse.offer && onClickOffer(currentlyChattingRoom?._id);
          }}
        ></PhoneIcon>

        <PhoneIcon
          className="button leave"
          onClick={(e) => {
            e.preventDefault();
            onLeaveButtonClick();
            navigate("/chat");
          }}
        ></PhoneIcon>
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
    width: 100vw;
    height: 90vh;
    position: relative;
    @media screen and (max-width: 750px) {
      flex-direction: column;
    }

    .local-video-screen {
      transition: 0.5s;

      width: 100%;
      height: 100%;
      background: black;
      transition: 0.5s;

      &.on-call {
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
      display: none;
      &.on-call {
        display: block;
      }
    }
  }
  .button-area {
    display: flex;
    flex-direction: row;
    gap: 30px;
    padding: 10px;
    .button {
      background-color: lightgray;
      border-radius: 50%;
      width: 70px;
      height: 70px;
      padding: 10px;
      cursor: pointer;
    }
    .call {
      background-color: green;
      color: white;
    }
    .leave {
      background-color: red;
      color: white;
    }

    @media screen and (max-width: 750px) {
      .button {
        width: 35px;
        height: 35px;
        padding: 7px;
      }
    }
  }
`;

export default VideoChatPage;
