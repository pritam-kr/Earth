import { Route, Routes } from "react-router-dom";
import styles from "./App.module.scss";

import { Home, View as ComponentView } from "./pages";
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
          <Route path="/v" element={<ComponentView />} />
        </Routes>
      </MainContainer>

      <Footer children={"Made with ReactJs"} />
      {settingModal && <SettingModal setModal={setSettingModal} />}
    </>
  );
}

export default App;
