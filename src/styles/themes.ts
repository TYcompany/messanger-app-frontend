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
  [key in ThemeType]: (typeof lightTheme | typeof darkTheme);
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
