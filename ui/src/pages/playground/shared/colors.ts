// bootstrap colors:

export interface Color {
  hex: string;
  isDark: boolean;
}

export type ColorMap<T> = {
  white: T;
  gray: T;
  green: T;
  black: T;
  yellow: T;
  orange: T;
  red: T;
  purple: T;
  teal: T;
  blue: T;
}

export const colorsPalette: ColorMap<Color> = {
  white: {
    hex: 'white',
    isDark: false
  },
  gray: {
    hex: '#d4d4d4',
    isDark: false
  },
  green: {
    hex: '#198754',
    isDark: true
  },
  black: {
    hex: '#444',
    isDark: true
  },
  red: {
    hex: '#dc3545',
    isDark: false
  },
  orange: {
    hex: '#fd7e14',
    isDark: false
  },
  yellow: {
    hex: '#ffc107',
    isDark: false
  },
  purple: {
    hex: '#910dfd',
    isDark: false
  },
  teal: {
    hex: '#0dcaf0',
    isDark: false
  },
  blue: {
    hex: '#125fff',
    isDark: false
  }
};

export const hotelColors: { [hotelIndex: number]: Color } = {
  [-1]: colorsPalette.gray,
  0: colorsPalette.green,
  1: colorsPalette.black,
  2: colorsPalette.red,
  3: colorsPalette.orange,
  4: colorsPalette.yellow,
  5: colorsPalette.teal,
  6: colorsPalette.purple,
};



const addColors = (colorMap: ColorMap<Color>) => {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = `
  :root {
    ${Object.entries(colorMap).map(([colorName, color]) => {
    return `--color-${colorName}: ${color.hex};`
  }).join('\n')}
  }
`;
  document.body.appendChild(styleElement);
};

addColors(colorsPalette);

