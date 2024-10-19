  import { Container, TextField, Button } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { io, Socket } from "socket.io-client";
  const socket: Socket = io("http://localhost:3000");
  const Room = () => {
    const [socketId, SetSocketId] = useState<string | undefined>();
    const [val, setVal] = useState<string>("");
    const [room, setRoom] = useState<string>("");

    const sendId = (e: React.FormEvent) => {
      e.preventDefault();
      if (val) {
        socket.emit("message",val);
        console.log(val, "---val");
        setVal("");
      }
    };

    useEffect(() => {
      socket.on("connect", () => {
        console.log(`connected with id:: ${socket.id}`);
        SetSocketId(socket.id);

        socket.on("message",(val)=>{
          console.log(val)
        })
      });

      return () => {
        socket.disconnect();
      };
    }, []);

    return (
      <>
        <Container maxWidth="sm">
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
              label="Send Room"
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
          <h3>
            Socket-id :: {socketId}
          </h3>
        </Container>
      </>
    );
  };

  export default Room;


