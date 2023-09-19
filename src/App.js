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
  const isError =
    (ReducerStates.locationsList?.isError &&
      ReducerStates.locationsList?.isError?.includes("Invalid API key.")) ||
    (ReducerStates.airPollutionInfo?.isError &&
      ReducerStates.airPollutionInfo?.isError?.includes("Invalid API key."));
  const [apiKeyModal, setApikeyModal] = useState(false);

  // Current country co-ordinates
  const [countryCoordinate, setCountryCoordinate] = useState("");

  // Maploading
  const [mapLoading, setMapLoading] = useState(false);

  //1.15.2 - Maplibrejs
  return (
    <>
      <Nav
        setApikeyModal={setApikeyModal}
        setCountryCoordinate={setCountryCoordinate}
      />
      <MainContainer>
        <Routes>
          <Route
            path="/"
            element={
              <Home mapLoading={mapLoading} setMapLoading={setMapLoading} />
            }
          />
          <Route
            path="/temprature"
            element={<Temprature countryCoordinate={countryCoordinate} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContainer>

      <Footer children={"Made with ReactJs"} />

      {(isError || apiKeyModal) && (
        <SettingModal setApikeyModal={setApikeyModal} />
      )}
      <Toaster
        position="top-center"
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
