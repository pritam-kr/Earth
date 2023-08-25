import { Route, Routes } from "react-router-dom";
import { Home, Temprature } from "./pages";
import { Footer, MainContainer, Nav } from "./components";
import SettingModal from "./modals/settingModal/SettingModal";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState } from "react";
import NotFound from "./pages/404/NotFound";

function App() {
  const ReducerStates = useSelector((state) => state.mapReducer);
  const error =
    (ReducerStates.locationsList?.error &&
      ReducerStates.locationsList?.error?.includes("Invalid API key.")) ||
    (ReducerStates.airPollutionInfo?.error &&
      ReducerStates.airPollutionInfo?.error?.includes("Invalid API key."));
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContainer>

      <Footer children={"Made with ReactJs"} />
      {(error || apiKeyModal) && <SettingModal />}
      <Toaster
        position="top-left"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "toast",
          duration: 20000,
          style: {
            // background: "#363636",
            color: "#282828",
            fontFamily: "Noto Sans, sans-serif",
            textTransform: "capitalize",
            border: "1px solid #0000001f",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },

          error: {
            duration: 5000,

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
