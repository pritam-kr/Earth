import html2canvas from "html2canvas";
import { useState } from "react";

export const useScreenShot = () => {
  const [loading, setLoading] = useState(false);

  const takeScreenShot = (element) => {
    setLoading(true);
    html2canvas(element).then((canvas) => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL();
      if (a.href) {
        setLoading(false);
      }
      a.download = "screenshot.jpg";
      a.click();
    });
  };

  return { loading, takeScreenShot };
};
