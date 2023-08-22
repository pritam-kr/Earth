import { useEffect } from "react";

const useOutSideClick = (ref, callback, dependencies = []) => {
  useEffect(() => {
    window.addEventListener("click", (e) => {
      e.stopPropagation();
      if (ref?.current && e.target !== ref?.current) {
        callback();
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
    };
  }, [ref, ...dependencies]);
};

export default useOutSideClick;
