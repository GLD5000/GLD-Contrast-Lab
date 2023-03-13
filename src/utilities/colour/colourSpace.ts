export const colourSpace = {
  splitHexString(string: string) {
    return string.length === 7
      ? [
          [string[1], string[2]],
          [string[3], string[4]],
          [string[5], string[6]],
        ]
      : [
          [string[1], string[1]],
          [string[2], string[2]],
          [string[3], string[3]],
        ];
  },
  hexDigitsToDecimal(digits: Array<string>) {
    const converted = parseInt(`${digits[0]}${digits[1] || digits[0]}`, 16);
    return converted / 255;
  },
  hexDigitsToInteger(digits: Array<string>) {
    const converted = parseInt(`${digits[0]}${digits[1] || digits[0]}`, 16);
    return converted;
  },
  decimalToHex(decimal: number) {
    const hex = Math.round(decimal * 255).toString(16);
    return hex.length === 2 ? hex : `0${hex}`;
  },
  integerToHex(integer: number) {
    const hex = integer.toString(16);
    return hex.length === 2 ? hex : `0${hex}`;
  },

  convertHexToSrgbArray(hex: string) {
    const splitHex = colourSpace.splitHexString(hex);
    return splitHex.map((digits) => colourSpace.hexDigitsToDecimal(digits));
  },
  convertHextoRgb(hex: string) {
    const splitHex = colourSpace.splitHexString(hex);
    return splitHex.map((digits) => colourSpace.hexDigitsToInteger(digits));
  },
  convertHextoRgbString(hex: string) {
    const splitHex = colourSpace.splitHexString(hex);
    const rgbArray = splitHex.map((digits) => colourSpace.hexDigitsToInteger(digits));
    return `RGB(${rgbArray.join(', ')})`;
  },
  convertHexToHslString(hex: string) {
    const srgb = colourSpace.convertHexToSrgbArray(hex);
    const hslArray = colourSpace
      .convertSrgbToHslArray(srgb)
      .map((x, i) => (i === 0 ? x.toFixed(0) : `${x.toFixed(0)}%`));
    return `HSL(${hslArray.join(', ')})`;
  },
  convertHexToHslArray(hex: string) {
    if (hex.length !== 7) return [0, 0, 0];
    const srgb = colourSpace.convertHexToSrgbArray(hex);
    const hslArray = colourSpace.convertSrgbToHslArray(srgb);
    return hslArray;
  },
  convertHextoRgbStringLb(hex: string) {
    const splitHex = colourSpace.splitHexString(hex);
    const rgbArray = splitHex.map((digits) => colourSpace.hexDigitsToInteger(digits));
    return `RGB\r\n${rgbArray.join(', ')}`;
  },
  convertHexToHslStringLb(hex: string) {
    const srgb = colourSpace.convertHexToSrgbArray(hex);
    const hslArray = colourSpace
      .convertSrgbToHslArray(srgb)
      .map((x, i) => (i === 0 ? x.toFixed(0) : `${x.toFixed(0)}%`));
    return `HSL\r\n${hslArray.join(', ')}`;
  },
  constrainSrgbArray(arrayIn: Array<number>) {
    return arrayIn.map((x) => Math.min(1, Math.max(0, x)));
  },

  convertSrgbToHslArray(srgbArray: Array<number>) {
    const [red, green, blue] = colourSpace.constrainSrgbArray(srgbArray);

    const cMin = Math.min(red, green, blue);
    const cMax = Math.max(red, green, blue);
    const delta = cMax - cMin;
    let hue = 0;
    let sat = 0;
    let lum = 0;
    if (delta === 0) hue = 0;
    else if (cMax === red) hue = ((green - blue) / delta) % 6;
    else if (cMax === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;

    hue *= 60;
    if (hue < 0) hue += 360;
    if (hue > 360) hue -= 360;

    lum = (cMax + cMin) / 2;
    sat = Math.max(0, Math.min(1, delta === 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1))));
    sat = +(sat * 100);
    lum = +(lum * 100);
    const hslArray = [hue, sat, lum];

    return hslArray;
  },
  convertHslArrayToSrgb(hslArray: Array<number>) {
    const constrainedArray = colourSpace.constrainHslArray(hslArray);
    const [hue] = constrainedArray;
    let [, sat, lum] = constrainedArray;

    sat /= 100;
    lum /= 100;

    const chroma = (1 - Math.abs(2 * lum - 1)) * sat;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const lightness = lum - chroma / 2;
    let red = 0;
    let green = 0;
    let blue = 0;

    if (hue >= 0 && hue < 60) {
      red = chroma;
      green = x;
      blue = 0;
    } else if (hue >= 60 && hue < 120) {
      red = x;
      green = chroma;
      blue = 0;
    } else if (hue >= 120 && hue < 180) {
      red = 0;
      green = chroma;
      blue = x;
    } else if (hue >= 180 && hue < 240) {
      red = 0;
      green = x;
      blue = chroma;
    } else if (hue >= 240 && hue < 300) {
      red = x;
      green = 0;
      blue = chroma;
    } else if (hue >= 300 && hue <= 360) {
      red = chroma;
      green = 0;
      blue = x;
    }
    red += lightness;
    green += lightness;
    blue += lightness;

    return [red, green, blue];
  },
  parseHslStringToArray(stringIn: string) {
    const arrayValue = stringIn
      .toLowerCase()
      .replaceAll(/[hsl( )%]/g, '')
      .split(',')
      .map((x) => parseInt(x, 10));
    return arrayValue;
  },
  convertHslStringToHex(stringIn: string) {
    const arrayValue = colourSpace.parseHslStringToArray(stringIn);
    return colourSpace.convertHslArrayToHex(arrayValue);
  },
  convertHslArrayToHex(hslArray: Array<number>) {
    return colourSpace.convertSrgbToHex(colourSpace.convertHslArrayToSrgb(hslArray));
  },
  convertSrgbToHex(srgbArray: Array<number>) {
    return srgbArray.reduce((acc, curr) => `${acc}${colourSpace.decimalToHex(curr)}`, '#');
  },
  convertRgbToHex(srgbArray: Array<number>) {
    return srgbArray.reduce((acc, curr) => `${acc}${colourSpace.integerToHex(curr)}`, '#');
  },

  constrainNumber(inputNumber = 0, min = 0, max = 100) {
    return Math.min(max, Math.max(min, inputNumber));
  },
  constrainHslArray(arrayInput: Array<number>) {
    return arrayInput.map((x, i) => {
      if (i === 0) return colourSpace.constrainNumber(x, 0, 360);
      return colourSpace.constrainNumber(x);
    });
  },
};
export default function hexToSrgb(hex: string) {
  return colourSpace.convertHexToSrgbArray(hex);
}
