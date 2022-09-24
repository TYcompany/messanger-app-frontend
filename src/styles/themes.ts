//import hexToRGBA from "../lib/etc/hexToRgba";

//style informations

const getRgbaString = (red: number, green: number, blue: number, alpha: number) => {
  return `rgba(${red.toString()}, ${green.toString()}, ${blue.toString()}, ${alpha.toString()})`;
};

const getGrayList = (n: number) => {
  const Unit = (255 / n) | 0;
  return Array.from(Array(n).keys()).map((num) =>
    getRgbaString(num * Unit, num * Unit, num * Unit, 1)
  );
};

const getLightBlueList = (n: number) => {
  //to lighter
  //red == 0 -> 180
  //green 128 ->218
  //blue 255

  const RedUnit = (180 / n) | 0;
  const GreenUnit = (100 / n) | 0;

  return Array.from(Array(n).keys()).map((num) =>
    getRgbaString(RedUnit * num, 128 + GreenUnit * num, 255, 1)
  );
};

const getDarkBlueList = (n: number) => {
  //red ==0
  //green ===  64 =>128
  //blue ==== 122.5=> 255

  const GreenUnit = (64 / n) | 0;
  const BlueUnit = (122.5 / n) | 0;

  return Array.from(Array(n).keys()).map((num) =>
    getRgbaString(0, 64 + GreenUnit * num, 122.5 + BlueUnit * num, 1)
  );
};

// darker -> lighter
const Color = {
  gray: getGrayList(10),
  lightBlue: getLightBlueList(10),
  darkBlue: getDarkBlueList(10),
};

export enum ThemeType {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

const lightTheme = {
  background: ["#fff"],
  grays: [],
};

//#ffffff39 , Button#9186f3

const darkTheme = {
  //buttons
  buttonDefault: "#ffffff39",
  buttonActive: "#9186f3",

  background: ["rgba(0, 0, 0, 0.87)", "#131324"],
  
  grays: [],
};

type ThemeInterface = {
  [key in ThemeType]: typeof lightTheme | typeof darkTheme;
};

const themes: ThemeInterface = {
  LIGHT: lightTheme,
  DARK: darkTheme,
};

// const color = {
//     red: "#FFF6F6",
//     black: "#191919"
//   }

//   export type Color = typeof color

//   export default { color }

export default themes;
