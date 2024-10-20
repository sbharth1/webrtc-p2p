  import { Container, TextField, Button } from "@mui/material";
  import React, { useEffect, useRef, useState } from "react";
  import { io, Socket } from "socket.io-client";
  const socket: Socket = io("http://localhost:3000");
  const Room = () => {
    const [socketId, SetSocketId] = useState<string | undefined>();
    const [val, setVal] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const [allMsg, setAllMsg] = useState<string[]>([]);
    const [peerConnection,setPeerConnection] = useState()
    const remoteVideo = useRef<HTMLVideoElement | null>(null);
    const localVideo = useRef<HTMLVideoElement | null>(null);

    const sendId = (e: React.FormEvent) => {
      e.preventDefault();
      if (val) {
        socket.emit("message",{room,val});
        console.log(val, "---val");
        setVal("")
      }
    };

    useEffect(() => {

           const pc = new RTCPeerConnection();
           
          //  exchange ice candidates
           pc.onicecandidate  = (event)=>{
            if(event.candidate){
              socket.emit("ice-candidate",event.candidate)
            }
           };
    
          //  handle remote media tracks

          pc.ontrack =(event)=>{
            if(remoteVideo.current){
              remoteVideo.current.srcObject = event.streams[0];
          }}

          localVideo.current!.srcObject = new MediaStream();
          navigator.mediaDevices.getUserMedia({video:false,audio:false})
          .then((stream) => { 
             stream.getTracks().map((track)=> pc.addTrack(track,stream))
             if(localVideo.current)
             localVideo.current.srcObject = stream;
            })
          

      socket.on("connect", () => {
        console.log(`connected with id:: ${socket.id}`);
        SetSocketId(socket.id);

      
        socket.on('offer',async (offer)=>{
             await pc.setRemoteDescription(new RTCSessionDescription(offer))
             const answer = await pc.createAnswer()
             await pc.setLocalDescription(answer)
             socket.emit("answer",answer)
        })

        socket.on("answer",async(answer)=>{
          await pc.remoteDescription(new RTCSessionDescription(answer))
        })

         socket.on("candidate",async(candidate)=>{
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
         })
         setPeerConnection(pc)
         console.log(pc)

        socket.on("message",(val:string)=>{
          setAllMsg((prev)=> [...prev,val])
        })
      });

      return () => {
        socket.off()
        socket.disconnect();
      };
    }, []);

    return (
      <>
        <Container maxWidth="sm">
        <video ref={localVideo} autoPlay muted></video>
        <video ref={remoteVideo} autoPlay></video>
    <br/>
          <form onSubmit={sendId}>
            <TextField
              id="outlined-basic"
              label="Send msg"
              variant="outlined"
              sx={{ marginTop: 10 }}
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Socket Id"
              variant="outlined"
              sx={{ marginTop: 10 }}
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <Button
              type="submit" 
              variant="contained"
              sx={{ marginTop: 11, marginLeft: 2 }}
            >
              Send
            </Button>
          </form>
          <ul>
          {allMsg.map((msg, index) => (
        <li key={index}>{msg}</li>
      ))}
          </ul>
          <h3>
            Socket-id :: {socketId}
          </h3>
        </Container>
      </>
    );
  };

  export default Room;


