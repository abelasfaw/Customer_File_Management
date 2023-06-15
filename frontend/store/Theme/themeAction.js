import * as types from "./themeTypes";

export const setDarkTheme = () => {
  return {
    type: types.SET_DARK_THEME,
  };
};

export const setLightTheme = () => {
  return {
    type: types.SET_LIGHT_THEME,
  };
};
