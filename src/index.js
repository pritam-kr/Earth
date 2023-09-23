import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { MapContextProvider } from "./context/mapContext";
import { WeatherContextProvider } from "./context/weatherContext";
import { ErrorContextProvider } from "./context/errorContext";

// Create a client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorContextProvider>
        <MapContextProvider>
          <WeatherContextProvider>
            <QueryClientProvider client={queryClient}>
              <Provider store={store} r>
                <App />
              </Provider>
            </QueryClientProvider>
          </WeatherContextProvider>
        </MapContextProvider>
      </ErrorContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
