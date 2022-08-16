import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FetchUserContactsRoute } from '../../lib/api/APIRoutes';
import ContactComponent from './ContactComponent';
import { UserType } from '../../lib/types/UserType';

function ChatPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<UserType[]>([])
  const [currentUser, setCurrentUser] = useState({ _id: '' });
  const [currentlyChattingUser, setCurrentlyChattingUser] = useState<UserType>({
    userName: "",
    email: "",
    profileImage: "",
    _id: ""
  });


  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login')
      return
    }
    const user = localStorage.getItem('chat-app-user') || ""

    setCurrentUser(JSON.parse(user));
  }, [navigate])

  useEffect(() => {
    if (!currentUser) {
      return
    }
    const fetchUserContacts = async (id: string) => {
      const { data } = await axios.get(`${FetchUserContactsRoute}/${id}`)

      setContacts(data)
    }
    fetchUserContacts(currentUser._id);
  }, [currentUser])

  return (<Container>
    <div className='container'>
      <ContactComponent contacts={contacts} currentUser={currentUser}
        currentlyChattingUser={currentlyChattingUser}
        setCurrentlyChattingUser={setCurrentlyChattingUser} />
    </div>
  </Container>

  )
}

const Container = styled.div`
    height:100vh;
    width:100vw;
    display:flex ;
    flex-direction: column ;
    justify-content:center ;
    gap:1rem;
    align-items:center ;
    background-color:#131324 ;
    .container{
        height: 85vh;
        width: 85vw;
        background-color:#00000076 ;
        display:grid ;
        grid-template-columns:25% 75% ;
        @media screen and (min-width:720px) and (max-width:1080px){
            grid-template-columns:35% 65% ;
        }
    }

`;

export default ChatPage