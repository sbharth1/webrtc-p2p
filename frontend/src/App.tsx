import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./Components/Room";
import Peer from "./Components/Peer";
import { CssBaseline } from "@mui/material";

const socket: Socket = io("http://localhost:3000");

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`connected with id:: ${socket.id}`);
    });
  });

  return (
    <>
      <CssBaseline>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Room />}></Route>
            <Route path="/peer" element={<Peer />}></Route>
          </Routes>
        </BrowserRouter>
      </CssBaseline>
    </>
  );
};

export default App;
