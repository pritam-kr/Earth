import { Route, Routes } from "react-router-dom";

import { Home, View as ComponentView, Temprature } from "./pages";
import { Footer, MainContainer, Nav } from "./components";
import SettingModal from "./modals/settingModal/SettingModal";
import { useState } from "react";

function App() {
  const [settingModal, setSettingModal] = useState(false);

  return (
    <>
      <Nav />
      <MainContainer>
        <Routes>
          <Route path="/" element={<Home setModal={setSettingModal} />} />
          <Route path="/temprature" element={<Temprature />} />
          <Route path="/v" element={<ComponentView />} />
        </Routes>
      </MainContainer>

      <Footer children={"Made with ReactJs"} />
      {settingModal && <SettingModal setModal={setSettingModal} />}
    </>
  );
}

export default App;
