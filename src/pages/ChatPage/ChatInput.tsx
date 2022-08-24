import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

import Picker from "emoji-picker-react";
import { UserType } from "../../lib/types/UserType";

import { SendMessageRoute } from "../../lib/api/APIRoutes";
import axios from "axios";

function ChatInput({
  currentUser,
  currentlyChattingUser,
}: {
  currentUser: UserType | undefined;
  currentlyChattingUser: UserType | undefined;
}) {
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {}, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message?.length <= 0) {
      return;
    }
    sendMessage();
  };

  const sendMessage = async () => {
    await axios.post(SendMessageRoute, {
      from: currentUser?._id,
      to: currentlyChattingUser?._id,
      text: message,
    });
    setMessage("");
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={() => setIsPickerActive(!isPickerActive)} />
          {isPickerActive && (
            <Picker onEmojiClick={(e, emoji) => setMessage(message + emoji.emoji)} />
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => onSubmit(e)}>
        <input
          type="text"
          placeholder="type your message here!"
          value={message}
          name="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9186f3;

        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          color: #aaa;
          background-color: transparent;
          border-color: #9186f3;
        }
        .emoji-group::before {
          background-color: #080420;
        }
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9186f3;
            border-radius: 5px;
          }
        }
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    gap: 2rem;
    width: 100%;
    border-radius: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      font-size: 1.2rem;
      padding-left: 1rem;
      &::selection {
        background-color: #9186f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      background-color: #9a86f3;
      border: none;
      font-size: 2rem;
      color: white;
    }
  }
`;

export default ChatInput;
