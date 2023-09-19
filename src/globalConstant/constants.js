export const MENUS = [
  { label: "Air Quality", value: "air pollution", path: "/" },
  { label: "Weather info", value: "temprature", path: "/temprature" },
  // { label: "Water Pollution", value: "water pollution", path: "/2" },
  // { label: "Heat Wave", value: "head wave", path: "/3" },
];

export const LOGO =
  "https://i.pinimg.com/originals/f3/7e/bb/f37ebbea1f4318dec775a4d705bd7cca.gif";

export const navLinks = (pathname) => {
  if (pathname === "/") {
    return "Air Quality";
  } else if (pathname === "/temprature") {
    return "Weather info";
  } else {
    return "Not found";
  }
};
