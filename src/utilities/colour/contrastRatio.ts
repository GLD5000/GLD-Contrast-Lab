import hexToLuminance from './luminance';

export const contrast = {
  getContrastRatioFloat(args: Array<number>) {
    const maxLum = Math.max(...args);
    const minLum = Math.min(...args);
    return (maxLum + 0.05) / (minLum + 0.05);
  },
  getContrastRatio2Dp(args: Array<number>) {
    const maxLum = Math.max(...args);
    const minLum = Math.min(...args);
    const ratio = (maxLum + 0.05) / (minLum + 0.05);
    return Math.floor(ratio * 100) / 100;
  },
  makeContrastRatingString(ratio: number) {
    let rating = 'unrated';
    if (ratio < 3) rating = 'Poor';
    if (ratio >= 3 && ratio < 4.5) rating = 'Low';
    if (ratio === 4.5) rating = 'AA';
    if (ratio > 4.5 && ratio < 7) rating = 'AA+';
    if (ratio === 7) rating = 'AAA';
    if (ratio > 7) rating = 'AAA+';

    return `Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;
  },
  makeContrastRating(ratio: number) {
    let rating = 'unrated';
    if (ratio < 3) rating = 'Poor';
    if (ratio >= 3 && ratio < 4.5) rating = 'Low';
    if (ratio === 4.5) rating = 'AA';
    if (ratio > 4.5 && ratio < 7) rating = 'AA+';
    if (ratio === 7) rating = 'AAA';
    if (ratio > 7) rating = 'AAA+';

    return rating;
  },
  makeContrastSuitability(ratio: number) {
    let rating = 'unrated';
    if (ratio < 3) rating = 'None';
    if (ratio >= 3 && ratio < 4.5) rating = 'Non-Txt';
    if (ratio >= 4.5 && ratio < 7) rating = 'Lg-Txt';
    if (ratio >= 7) rating = 'Any';

    return rating;
  },

  luminanceAboveCutoff(luminance: number) {
    const luminanceCutoff = 0.1791287847;
    return luminance > luminanceCutoff;
  },
  clampLuminance(luminance: number) {
    return Math.min(1, Math.max(0, luminance));
  },
  calculateMinLuminance(maxLuminance: number, targetContrast: number) {
    const minLuminance = (-0.05 * targetContrast + maxLuminance + 0.05) / targetContrast;
    return contrast.clampLuminance(minLuminance);
  },
  calculateMaxLuminance(minLuminance: number, targetContrast: number) {
    const maxLuminance = targetContrast * (minLuminance + 0.05) - 0.05;
    return contrast.clampLuminance(maxLuminance);
  },
  luminanceToLinear(relativeLuminance: number) {
    return contrast.clampLuminance(1.055 * relativeLuminance ** (1 / 2.4) - 0.055);
  },
};
export default function getContrastRatio(luminanceArray: Array<number>) {
  return contrast.getContrastRatio2Dp(luminanceArray);
}

export function getContrastRatioFromHex(hexA: string, hexB: string) {
  const lumA = hexToLuminance(hexA);
  const lumB = hexToLuminance(hexB);
  return getContrastRatio([lumA, lumB]);
}
