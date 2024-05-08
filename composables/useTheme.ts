import { usePreferredColorScheme, useStyleTag } from '@vueuse/core';
import { getColors } from 'theme-colors';

type ColorName = 'background' | 'foreground' | 'primary' | 'secondary' | 'alert' | 'warning' | 'success';
type OtherVariables = 'border-radius' | 'animation';
type ThemeMode = 'dark' | 'light' | 'default';

export type ThemeVariables = {
  colors: Record<ColorName, string>;
  other: Record<OtherVariables, string>;
}

type GetColorsResult = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export const THEME_DARK: ThemeVariables = {
  colors: {
    background: '#263238',
    foreground: '#eceff1',
    primary: '#6a1b9a',
    secondary: '#3c82fa',
    alert: '#f14235',
    warning: '#f5a623',
    success: '#7bbb44'
  },
  other: {
    'border-radius': '4px',
    'animation': '0.1s ease-in-out'
  }
}

export const THEME_LIGHT: ThemeVariables = {
  ...THEME_DARK,
  colors: {
    ...THEME_DARK.colors,
    background: '#eceff1',
    foreground: '#0b0f11'
  }
}

export default function() {
  function createStyles(theme: ThemeMode = 'default') {
    let themeVariables: ThemeVariables;
    if (theme === 'dark') {
      themeVariables = THEME_DARK;
    } else if (theme === 'light') {
      themeVariables = THEME_LIGHT;
    } else {
      const preferredColor = usePreferredColorScheme()
      if (preferredColor.value === 'light') {
        themeVariables = THEME_LIGHT;
      } else { // dark or no-preference
        themeVariables = THEME_DARK;
      }
    }
    const styles = {};
    for (const [colorName, baseColor] of Object.entries(themeVariables.colors)) {
      const colors = getColors(baseColor) as GetColorsResult;
      if (theme === 'light') {
        let backup = colors[100];
        colors[100] = colors[900]
        colors[900] = backup;
        backup = colors[200];
        colors[200] = colors[800]
        colors[800] = backup;
        backup = colors[300];
        colors[300] = colors[700]
        colors[700] = backup;
        backup = colors[400];
        colors[400] = colors[600]
        colors[600] = backup;
      }
      for (const [shade, color] of Object.entries(colors)) {
        styles[`--color-${colorName}-${shade}`] = color;
      }
    }
    for (const [key, value] of Object.entries(themeVariables.other)) {
      styles[`--${key}`] = value;
    }
    return ':root ' + JSON.stringify(styles).replaceAll(',', ';').replaceAll('"', '');
  }

  const { css } = useStyleTag(createStyles(), { id: 'theme-variables' })

  function updateStyle(mode: ThemeMode = 'default') {
    css.value = createStyles(mode);
  }

  return {
    updateStyle
  }
}