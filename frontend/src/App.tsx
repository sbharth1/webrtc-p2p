import { useEffect } from 'react';
import {io, Socket} from 'socket.io-client'

const socket:Socket = io('http://localhost:3000');

const App = () => {

  useEffect(()=>{
    socket.on('connect',()=>{
      console.log(`connected with id:: ${socket.id}`)      
    })
  })

  return (
    <div>App</div>
  )
}

export default App