export const contrast = {
  getContrastRatio(args: Array<number>) {
    const maxLum = Math.max(...args);
    const minLum = Math.min(...args);
    return (maxLum + 0.05) / (minLum + 0.05);
  },
  makeContrastRatioString(ratio: number) {
    let rating = 'unrated';

    if (ratio < 4.5) rating = 'low';
    if (ratio === 4.5) rating = 'AA';
    if (ratio > 4.5 && ratio < 7) rating = 'AA+';
    if (ratio === 7) rating = 'AAA';
    if (ratio > 7) rating = 'AAA+';

    return `Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;
  },
  makeContrastRating(ratio: number) {
    let rating = 'unrated';

    if (ratio < 4.5) rating = 'low';
    if (ratio === 4.5) rating = 'AA';
    if (ratio > 4.5 && ratio < 7) rating = 'AA+';
    if (ratio === 7) rating = 'AAA';
    if (ratio > 7) rating = 'AAA+';

    return rating;
  },
  luminanceAboveCutoff(luminance: number) {
    const luminanceCutoff = 0.1791287847;
    return luminance > luminanceCutoff;
  },
};

export default function getContrastRatio(luminanceArray: Array<number>) {
  return contrast.getContrastRatio(luminanceArray);
}
