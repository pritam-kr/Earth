import React from "react";
import { LOADER_GIF } from "./constant";

const Loader = ({
  src = LOADER_GIF,
  alt = "loader",
  width = 10,
  height = 10,
  className,
}) => {
  const Styling = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <img
      src={src}
      alt={alt}
      style={Styling}
      className={`${className ? className : ""}`}
    />
  );
};

export default Loader;
