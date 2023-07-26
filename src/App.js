import { Route, Routes } from "react-router-dom";
import styles from "./App.module.scss";

import { Home, View as ComponentView } from "./pages";
import { MainContainer, Sidebar } from "./components";
import SettingModal from "./modals/settingModal/SettingModal";
import { useState } from "react";

function App() {
  const [settingModal, setSettingModal] = useState(false);

  return (
    <MainContainer>
      <div className={styles.appContainer}>
        <div className={styles.sidebarContainer}>
          <Sidebar setModal={setSettingModal} />
        </div>

        <div className={styles.routesContainer}>
          <Routes>
            <Route path="/" element={<Home setModal={setSettingModal} />} />
            <Route path="/v" element={<ComponentView />} />
          </Routes>
        </div>
      </div>

      {settingModal && <SettingModal setModal={setSettingModal} />}
    </MainContainer>
  );
}

export default App;
