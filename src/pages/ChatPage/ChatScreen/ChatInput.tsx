import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

import Picker from "emoji-picker-react";
import { UserType } from "../../../lib/types/UserType";

function ChatInput({
  sendMessage,
  setText,
  text,
  isPickerActive,
  setIsPickerActive,
}: {
  sendMessage: Function;
  setText: Function;
  text: string;
  isPickerActive: Boolean;
  setIsPickerActive: Function;
}) {
  useEffect(() => {}, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text?.length <= 0) {
      return;
    }
    sendMessage();
  };

  return (
    <Container>
      <div className="button-container">
        <div className="new-message-notice">you have new message!</div>
        <div className="emoji">
          <BsEmojiSmileFill onClick={() => setIsPickerActive(!isPickerActive)} />
          {isPickerActive && <Picker onEmojiClick={(e, emoji) => setText(text + emoji.emoji)} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => onSubmit(e)}>
        <input
          type="text"
          placeholder="type your message here!"
          value={text}
          name="message"
          onChange={(e) => setText(e.target.value)}
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

  background-color: #080420;

  gap: 1rem;
  padding: 0.5rem 2rem;

  justify-content: center;
  align-items: center;
  position: relative;
  @media screen and (max-width: 760px) {
    width: 100vw;
    padding: 0.5rem 0.5rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .new-message-notice {
      position: absolute;
      background-color: gray;
      border-radius: 30px;
      padding: 7px 20px;
      left: 50%;
      top: -50px;
      transform:translateX(-50%) ;
    }

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
        //background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9186f3;

        @media screen and (max-width: 760px) {
          top: -350px;
        }

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
          //  background-color: #080420;
        }
        .emoji-scroll-wrapper::-webkit-scrollbar {
          //  background-color: #080420;
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
    display: grid;
    align-items: center;
    max-width: 95%;
    grid-template-columns: 80% 20%;
    border-radius: 2rem;
    background-color: #ffffff34;

    @media screen and (max-width: 760px) {
      max-width: calc(95% - 1rem);
      grid-template-columns: 80% 20%;
    }
    input {
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
      border-radius: 2rem;
      background-color: #9a86f3;
      border: none;
      font-size: 2rem;
      color: white;
    }
  }
`;

export default ChatInput;
