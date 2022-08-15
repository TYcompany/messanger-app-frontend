import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'

import { RegisterRoute } from '../lib/api/APIRoutes'

// toast.promise(
//   saveSettings(settings),
//    {
//      loading: 'Saving...',
//      success: <b>Settings saved!</b>,
//      error: <b>Could not save.</b>,
//    }
//  );

// {
//   icon: '👏',
//   style: {
//     borderRadius: '10px',
//     background: '#333',
//     color: '#fff',
//   },
// }

function RegisterPage() {
  const navigate = useNavigate()

  const [values, setValues] = useState({
    userName: '',
    email: '',
    password: "",
    passwordConfirm: ''
  })

  useEffect(()=>{
    if(localStorage.getItem('chat-app-user')){
      navigate('/')
    }
  },[navigate])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputValue()) {
      return;
    }
    const { password, passwordConfirm, userName, email } = values
    const res = await axios.post(RegisterRoute, {
      userName,
      email,
      password,
      passwordConfirm
    })

    if(res.status!==201){
      toast.error('register failed'+ res.data.message)
      return
    }
    
    localStorage.setItem('chat-app-user',JSON.stringify(res.data.user))
    toast(res.data.message)
    navigate('/')
    
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const validateInputValue = () => {
    const { password, passwordConfirm, userName, email } = values
    if (password !== passwordConfirm) {
      toast.error('password and passwordConfirm is not the same!')
      return false
    }

    if (userName.length < 5) {
      toast.error('userName should longer than 5 characters!')
      return false
    }
    if (password.length < 8) {
      toast.error('password should longer than 8 cahracters!')
      return false
    }

    return true
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className='title'>
            <img src="" alt="" />
            <h1>Register</h1>
          </div>

          <input type="text" placeholder='Username' name="userName" onChange={(e) => onChange(e)} />
          <input type="text" placeholder='Email' name="email" onChange={(e) => onChange(e)} />
          <input type="password" placeholder='Password' name="password" onChange={(e) => onChange(e)} />
          <input type="password" placeholder='Password confirm' name="passwordConfirm" onChange={(e) => onChange(e)} />
          <button type="submit">Sign up</button>
          <span>Already have an account? <Link to="/login">Login</Link> </span>
        </form>
      </FormContainer>
      <Toaster
        position="bottom-left"
        reverseOrder={true}
      />
    </>
  )
}

const FormContainer = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction: column ;
  gap:1rem;
  align-items:center ;
  background-color: #131324 ;
  .title{
    display:flex ;
    align-items: center ;
    gap:1rem;
    justify-content:center ;
  }

  form{
    display:flex ;
    flex-direction: column ;
    gap: 2rem;
    background-color: #00000076 ;
    border-radius: 2rem ;
    padding:3rem 5rem;
    input{
      background-color: transparent ;
      padding:1rem;
      border:0.1rem solid #4e0eff;
      border-radius: 0.4rem ;
      color:white;
      width:100%;
      font-size:1rem;
      &:focus{
        border:0.1rem solid #997af0;
        outline:none ;
      }
    }

    button{
      background-color:#997af0;
      color:white ;
      padding:1rem 2rem;
      border:none;
      cursor: pointer;
      border-radius:0.4rem ;
      font-size: 1rem;
      transition:0.5 ease-in-out ;
      &:hover{
        background-color:#4e0eff;
        }
    }

    span{
      color:white;
      a{
        color:#4e0eff;
        font-weight:bold;
      }
    }

  }
`

export default RegisterPage