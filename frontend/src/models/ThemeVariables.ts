export default interface ThemeVariables {
  name: string;
  background: string;
  backgroundLight: string;
  backgroundDark: string;
  foreground: string;
  foregroundLight: string;
  foregroundDark: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  alert: string;
  alertLight: string;
  alertDark: string;
  warning: string;
  success: string;
  appBackground: string;
  borderRadius: number;
}

export const DEFAULT: ThemeVariables = {
  name: "default",
  background: "#263238",
  backgroundLight: "#4f5b62",
  backgroundDark: "#000a12",
  foreground: "#eceff1",
  foregroundLight: "#fff",
  foregroundDark: "#babdbe",
  primary: "#6a1b9a",
  primaryLight: "#9c4dcc",
  primaryDark: "#38006b",
  secondary: "#3c82fa",
  secondaryLight: "#4f8efa",
  secondaryDark: "#065cf1",
  alert: "#f14235",
  alertLight: "#f3675d",
  alertDark: "#e91f10",
  warning: "#f5a623",
  success: "#7bbb44",
  appBackground: "#11171a",
  borderRadius: 4,
};

export const LIGHT_NORN: ThemeVariables = {
  name: "light_norn",
  background: "#fff",
  backgroundLight: "#eee",
  backgroundDark: "#ddd",
  foreground: "#5f6368",
  foregroundLight: "#777c82",
  foregroundDark: "#4d4f52",
  primary: "#6a1b9a",
  primaryLight: "#9c4dcc",
  primaryDark: "#38006b",
  secondary: "#3c82fa",
  secondaryLight: "#4f8efa",
  secondaryDark: "#065cf1",
  alert: "#f14235",
  alertLight: "#f3675d",
  alertDark: "#e91f10",
  warning: "#f5a623",
  success: "#7bbb44",
  appBackground: "#f8f9fa",
  borderRadius: 4,
};

export const THEMES: ThemeVariables[] = [DEFAULT, LIGHT_NORN];
