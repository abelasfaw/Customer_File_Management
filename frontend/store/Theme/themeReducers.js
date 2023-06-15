import * as types from "./themeTypes";
const initialState = {
  darkTheme: false,
};
export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_DARK_THEME:
      return {
        darkTheme: true,
      };
    case types.SET_LIGHT_THEME:
      return {
        darkTheme: false,
      };

    default:
      return state;
  }
};
