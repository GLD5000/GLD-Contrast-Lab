import hexToLuminance from './luminance';

export const autoTextColour = {
  backgroundLuminanceToTextColour(backgroundLuminance: number) {
    function luminanceAboveCutoff(luminance: number) {
      const luminanceCutoff = 0.1791287847;
      return luminance > luminanceCutoff;
    }

    const backgroundLuminanceIsAboveCutoff = luminanceAboveCutoff(backgroundLuminance);
    const textColour = backgroundLuminanceIsAboveCutoff ? '#000000' : '#ffffff';
    return textColour;
  },
  autoTextColourFromHex(hex: string) {
    const backgroundLuminance = hexToLuminance(hex);
    const textColour = autoTextColour.backgroundLuminanceToTextColour(backgroundLuminance);
    return textColour;
  },
};

export default function autoTextColourFromHex(hex: string) {
  return autoTextColour.autoTextColourFromHex(hex);
}
