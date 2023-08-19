import { toast } from "react-hot-toast";

const useCurrentLanLat = () => {
  const getLonLatCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((coordinate) => {
          if (coordinate.coords.latitude && coordinate.coords.longitude) {
            resolve({
              longitude: coordinate.coords.longitude,
              latitude: coordinate.coords.latitude,
            });
          }
        });
      } else {
        toast.error("Something went wrong, Try again later!");
      }
    });
  };

  return {
     getLonLatCoordinates,
  };
};

export default useCurrentLanLat;
