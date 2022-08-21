import React from 'react'

function MainPage() {
  const onLogout = () => {
    localStorage.setItem('chat-app-user', '')
  }
  return (
    <div>MainPage
      <button onClick={() => onLogout()}>Logout</button>
    </div >
  )
}

export default MainPage