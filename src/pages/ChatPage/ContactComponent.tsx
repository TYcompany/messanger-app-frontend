import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { UserType } from '../../lib/types/UserType';

function ContactComponent({ contacts, currentUser,
  currentlyChattingUser, setCurrentlyChattingUser }:
  {
    contacts: Array<UserType>, currentUser: {},
    currentlyChattingUser: UserType,
    setCurrentlyChattingUser: Function
  }) {

  const [selectedUser, setSelectedUser] = useState(0)
  useEffect(() => {
    if (!currentUser) {
      return
    }

  }, [currentUser])

  const onClickUserContact = (index: number, contact: Object) => {
    setCurrentlyChattingUser(contact)
    setSelectedUser(index)
  }

  return (
    <Container>
      <div className='brand'>
        <img src={""} alt='logo' />
        <h3>Chat</h3>
      </div>
      <div className='contacts'>
        {contacts.map((contact, index) => <div key={'contact' + index}
          className={`contact ${selectedUser === index && 'selected'}`}>
          <div className='profile-image'>
            <img
              src={`data:image/svg+xml;base64,${contact?.profileImage}`}
              alt={"profile" + index}
              onClick={() => onClickUserContact(index, contact)}
            />
          </div>
          <div className="username">
            <h3>{contact.userName}</h3>
          </div>
        </div>)}
        <div key={'currently-chatting-user'}
          className={`currently-chatting-user`}>
          <div className='profile-image'>
            <img
              src={`data:image/svg+xml;base64,${currentlyChattingUser.profileImage}`}
              alt={"profile"}
            />
          </div>
          <div className="username">
            <h2>{currentlyChattingUser.userName}</h2>
          </div>
        </div>
      </div>
    </Container>
  )
}


const Container = styled.div`
  display:grid ;
  grid-template-rows: 10% 75% 15% ;
  overflow:hidden;
  background-color: #080420 ;
  .brand{
    display:flex ;
    align-items:center ;
    justify-content:center ;
    gap:1rem;
    img{
      height:2rem;
    }
    h3{
      color:white;
    }
  }
  
  .contacts{
    display:flex ;
    flex-direction:column ;
    align-items:center ;
    overflow:auto ;
    gap:0.8rem;
    .contact{
      &::-webkit-scrollbar{
        background-color:#ffffff39 ;
        width:1rem;
        border-radius:1rem ;
      }
      background-color:#ffffff39 ;
      min-height:5rem ;
      width:90%;
      cursor: pointer;
      border-radius: 0.2rem ;
      padding:0.4rem;
      gap:1rem;
      align-items:center ;
      display:flex ;
      transition:0.5s ease-in-out;

      .profile-image{
        img{height:3rem;}
      }
      .username{
        h3{
          color:white;
        }
      }
      .selected{
        background-color:#9186f3 ;
      }
    }
    .currently-chatting-user{
        background-color:#0d0d30 ;
        display:flex ;
        justify-content:center ;
        align-items:center ;
        gap:2rem;
        .profile-image{
          img{
            height:4rem;
            max-inline-size:100% ;
          }
        }
        .username{
          h2{
            color:white
          }
        }

        @media screen and (min-width:720px) and (max-width:1080px){
            gap:0.5rem;
            .username{
              h2{
                font-size:1rem;
              }
            }
        }

      }
  }
`;



export default ContactComponent