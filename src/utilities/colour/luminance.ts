import hexToSrgb, { colourSpace } from './colourSpace';

export const luminance = {
  modifyColourValue(value: number) {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  },
  modifyColourValueRgb(value: number) {
    const srgbValue = value / 255;
    return srgbValue <= 0.04045 ? srgbValue / 12.92 : ((srgbValue + 0.055) / 1.055) ** 2.4;
  },
  sumColourValues(rgbArray: number[]) {
    const [R, G, B] = rgbArray;
    const redMult = 0.2126;
    const greenMult = 0.7152;
    const blueMult = 0.0722;
    return redMult * R + greenMult * G + blueMult * B;
  },
  getLuminanceWeighting(srgbValue: number[]) {
    const greenMult = 0.7152;
    const maxValue = srgbValue.reduce((acc, curr) => acc + curr) * greenMult;
    const currentValue = luminance.sumColourValues(srgbValue);
    const weightingRatio = currentValue / maxValue;
    return weightingRatio;
  },

  convertSrgbToLuminance(args: Array<number>) {
    const [R, G, B] = args.map(luminance.modifyColourValue);
    const summed = luminance.sumColourValues([R, G, B]);
    return summed;
  },
  convertRgbToLuminance(args: Array<number>) {
    const [R, G, B] = args.map(luminance.modifyColourValueRgb);
    const summed = luminance.sumColourValues([R, G, B]);
    return summed;
  },
  constrainDecimal(value: number) {
    return Math.min(1, Math.max(0, value));
  },
  convertLuminanceToSrgb(luminanceIn: number) {
    const constrainedLuminance = luminance.constrainDecimal(luminanceIn);
    const luminanceThreshold = 0.04045 / 12.92;
    const luminanceAboveThreshold = constrainedLuminance > luminanceThreshold;
    if (luminanceAboveThreshold) {
      const srgbDecimal = 1.055 * constrainedLuminance ** (1 / 2.4) - 0.055;
      return [srgbDecimal, srgbDecimal, srgbDecimal];
    }
    const srgbDecimal = constrainedLuminance * 12.92;
    return [srgbDecimal, srgbDecimal, srgbDecimal];
  },
  convertLuminanceToRgb(luminanceIn: number) {
    return luminance.convertLuminanceToSrgb(luminanceIn).map((x) => x * 255);
  },

  convertLuminanceToHex(luminanceIn: number) {
    return colourSpace.convertSrgbToHex(luminance.convertLuminanceToSrgb(luminanceIn));
  },
  convertHexToLuminance(hex: string) {
    const srgbArray = hexToSrgb(hex);
    const luminanceResult = this.convertSrgbToLuminance(srgbArray);
    return luminanceResult;
  },
  convertHexToLuminancePercent(hex: string) {
    const srgbArray = hexToSrgb(hex);
    const luminanceResult = this.convertSrgbToLuminance(srgbArray);
    const percentage = `${(luminanceResult * 100).toFixed(1)}%`;
    return percentage;
  },
};

export default function hexToLuminance(hex: string) {
  return luminance.convertHexToLuminance(hex);
}
