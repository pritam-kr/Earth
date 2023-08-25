import { Route, Routes } from "react-router-dom";
import { Home, Temprature } from "./pages";
import { Footer, MainContainer, Nav } from "./components";
import SettingModal from "./modals/settingModal/SettingModal";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState } from "react";

function App() {
  const ReducerStates = useSelector((state) => state.mapReducer);
  const error =
    ReducerStates.locationsList?.error || ReducerStates.airPollutionInfo?.error;

  const [apiKeyModal, setApikeyModal] = useState(false);

  //1.15.2 - Maplibrejs
  return (
    <>
      <Nav />
      <MainContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/temprature"
            element={<Temprature setApikeyModal={setApikeyModal} />}
          />
        </Routes>
      </MainContainer>

      <Footer children={"Made with ReactJs"} />
      {(error || apiKeyModal) && <SettingModal />}
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
