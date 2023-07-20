import { useState, useEffect } from "react";

const useCurrentLanLat = () => {
  const [coordinate, setCoordinate] = useState({
    latitude: "",
    longitude: "",
    isLoading: false,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      setCoordinate((prev) => ({ ...prev, isLoading: true }));
      navigator.geolocation.getCurrentPosition((coordinate) => {
        if (coordinate.coords.latitude && coordinate.coords.longitude)
          setCoordinate((prev) => ({
            latitude: coordinate.coords.latitude,
            longitude: coordinate.coords.longitude,
            isLoading: false,
          }));
      });
    } else {
      console.log("Unknown error try again later");
      setCoordinate((prev) => ({
        latitude: "",
        longitude: "",
        isLoading: false,
      }));
    }
  }, []);

  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    loading: coordinate.isLoading,
  };
};

export default useCurrentLanLat;
