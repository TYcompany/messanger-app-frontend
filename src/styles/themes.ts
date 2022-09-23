export enum ThemeType {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

const lightTheme = {
  background: ["#fff"],
  grays: [],
};
const darkTheme = {
  background: ["#131324"],
  grays: [],
};

type ThemeInterface = {
  [key in ThemeType]: Object;
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
