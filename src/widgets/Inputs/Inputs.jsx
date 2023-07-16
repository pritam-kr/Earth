import React from "react";

const Inputs = ({ type, placeholder, ...res }) => {
  const renderInput = (type) => {
    switch (type) {
      case !type:
        return <input placeholder={!placeholder ? "Enter Text" : placeholder} />;

      default:
        <input placeholder={!placeholder ? "Enter Text" : placeholder} />;
    }
  };

  return renderInput(type);
};

export default Inputs;
