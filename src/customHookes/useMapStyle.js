import { useState } from "react";

const useMapStyle = () => {
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets-v2/style.json?key=yu7UtJN0eOg536ACtL8z"
  );

  return { mapStyle, setMapStyle };
};

export default useMapStyle;
