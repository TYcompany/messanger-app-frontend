import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { UserType } from '../../lib/types/UserType';

function ContactComponent({ contacts, currentUser }: { contacts: Array<UserType>, currentUser: {} }) {
  const [currentUserName, setCurrentUserName] = useState("")
  const [currentUserImage, setCurrentUserImage] = useState('')
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    if (!currentUser) {
      return
    }

  }, [currentUser])

  const changeCurrentChat = (index, contact) => {

  }

  return (
    <Container>
      <div className='brand'>
        <img src={""} alt='logo' />
        <h3>Chat</h3>
      </div>
      <div className='contacts'>
        {contacts.map((contact, index) => <div key={'contact' + index}
          className={`contact ${selected === index && 'selected'}`}>
          <div className='profile-image'>
            <img
              src={`data:image/svg+xml;base64,${contact?.profileImage}`}
              alt={"profile" + index}
              onClick={() => setSelected(index)}
            />
          </div>
          <div className="username">
            <h3>{contact.userName}</h3>
          </div>
        </div>)}
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
  }
`;



export default ContactComponent