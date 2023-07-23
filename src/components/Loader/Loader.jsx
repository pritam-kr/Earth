import React from "react";

export const Loader = ({ src, alt = "loader", width = 10, height = 10 }) => {
  const Styling = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return <img src={src} alt={alt} style={Styling} />;
};