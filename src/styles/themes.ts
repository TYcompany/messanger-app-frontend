
//style informations

const getRgbaString = (red: number, green: number, blue: number, alpha: number) => {
  return `rgba(${red.toString()}, ${green.toString()}, ${blue.toString()}, ${alpha.toString()})`;
};

const getGrayList = () => {
  return Array.from(Array(11).keys()).map((num) => getRgbaString(0, 0, 0, num / 10));
};

const Color = {
  gray: getGrayList(),
};

console.log(Color);

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
