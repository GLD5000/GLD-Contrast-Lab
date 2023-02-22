import hexToSrgb from './colourSpace';

export const luminance = {
  modifyColourValue(value: number) {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  },
  sumColourValues(R: number, G: number, B: number) {
    const redMult = 0.2126;
    const greenMult = 0.7152;
    const blueMult = 0.0722;
    return redMult * R + greenMult * G + blueMult * B;
  },
  convertSrgbToLuminance(args: Array<number>) {
    const [R, G, B] = args.map(luminance.modifyColourValue);
    const summed = luminance.sumColourValues(R, G, B);
    return summed;
  },

  convertHexToLuminance(hex: string) {
    const srgbArray = hexToSrgb(hex);
    const luminanceResult = this.convertSrgbToLuminance(srgbArray);
    return luminanceResult;
  },
};

export default function hexToLuminance(hex: string) {
  return luminance.convertHexToLuminance(hex);
}
