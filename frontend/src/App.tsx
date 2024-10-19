import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./Components/Room";
import Peer from "./Components/Peer";
import { CssBaseline } from "@mui/material";


const App = () => {

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
