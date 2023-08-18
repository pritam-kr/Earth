import { Route, Routes } from "react-router-dom";
import { Home, Temprature } from "./pages";
import { Footer, MainContainer, Nav } from "./components";
import SettingModal from "./modals/settingModal/SettingModal";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const [settingModal, setSettingModal] = useState(false);

  return (
    <>
      <Nav />
      <MainContainer>
        <Routes>
          <Route path="/" element={<Home setModal={setSettingModal} />} />
          <Route path="/temprature" element={<Temprature />} />
        </Routes>
      </MainContainer>

      <Footer children={"Made with ReactJs"} />
      {settingModal && <SettingModal setModal={setSettingModal} />}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}

export default App;
