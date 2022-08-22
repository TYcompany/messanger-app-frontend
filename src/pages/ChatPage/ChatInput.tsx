import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

import Picker from "emoji-picker-react";

function ChatInput() {
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {}, []);

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
      <form className="input-container">
        <input
          type="text"
          placeholder="type your message here!"
          value={message}
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
