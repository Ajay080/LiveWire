import { useState } from 'react'
import ChatUI from './groupChat/chatUI.jsx'
import CreateSocketConnection from './groupChat/socketConnection.jsx'
function App() {
  return (
    <>
      <h1>LiveWire GUI</h1>
      <CreateSocketConnection />
      <ChatUI />
    </>
  )
}

export default App
