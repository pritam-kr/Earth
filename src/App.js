import { Route, Routes } from "react-router-dom";
import styles from "./App.module.scss"

import { Home, View as ComponentView } from "./pages";
import { MainContainer, Map, Sidebar } from "./components";



function App() {
  return (
    <MainContainer>
      <div className={styles.appContainer}>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>

        <div className={styles.routesContainer}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/v" element={<ComponentView />} />
          </Routes>
        </div>
      </div>
    </MainContainer>
  );
}

export default App;
