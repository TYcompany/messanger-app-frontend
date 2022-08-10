import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

function RegisterPage() {

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('form')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  }

  return (
    <FormContainer>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className='title'>
          <img src="" alt="" />
          <h1>Title</h1>
        </div>

        <input type="text" placeholder='Username' name="username" onChange={(e) => onChange(e)} />
        <input type="text" placeholder='Email' name="email" onChange={(e) => onChange(e)} />
        <input type="text" placeholder='Password' name="password" onChange={(e) => onChange(e)} />
        <input type="text" placeholder='Password confirm' name="password-confirm" onChange={(e) => onChange(e)} />
        <button type="submit">Sign up</button>
        <span>Already have an account? <Link to="/login">Login</Link> </span>
      </form>
    </FormContainer>
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