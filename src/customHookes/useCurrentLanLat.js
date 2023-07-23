import { useState, useEffect } from "react";

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
        reject("Something went wrong, Try again later!");
      }
    });
  };

  return {
    getLonLatCoordinates: getLonLatCoordinates,
  };
};

export default useCurrentLanLat;
