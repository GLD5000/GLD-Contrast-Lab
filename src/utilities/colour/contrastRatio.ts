export const contrast = {
  getContrastRatio(args: Array<number>) {
    const maxLum = Math.max(...args);
    const minLum = Math.min(...args);
    return (maxLum + 0.05) / (minLum + 0.05);
  },
  makeContrastRatingString(ratio: number) {
    let rating = 'unrated';

    if (ratio < 4.5) rating = 'Low';
    if (ratio === 4.5) rating = 'AA';
    if (ratio > 4.5 && ratio < 7) rating = 'AA+';
    if (ratio === 7) rating = 'AAA';
    if (ratio > 7) rating = 'AAA+';

    return `Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;
  },
  makeContrastRating(ratio: number) {
    let rating = 'unrated';

    if (ratio < 4.5) rating = 'Low';
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
  return contrast.getContrastRatio(luminanceArray);
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  (() => {
    const testFunc = 'makeContrastRatingString';
    describe(`#${testFunc}`, () => {
      it(`Works for range`, () => {
        expect(contrast[testFunc](3)).toStrictEqual(`Contrast Ratio: 3.00 Low`);
        expect(contrast[testFunc](4.5)).toStrictEqual(`Contrast Ratio: 4.50 AA`);
        expect(contrast[testFunc](4.6)).toStrictEqual(`Contrast Ratio: 4.60 AA+`);
        expect(contrast[testFunc](7)).toStrictEqual(`Contrast Ratio: 7.00 AAA`);
        expect(contrast[testFunc](7.1)).toStrictEqual(`Contrast Ratio: 7.10 AAA+`);
      });
    });
  })();

  (() => {
    const testFunc = 'makeContrastRating';
    describe(`#${testFunc}`, () => {
      it(`Works for range`, () => {
        expect(contrast[testFunc](3)).toStrictEqual(`Low`);
        expect(contrast[testFunc](4.5)).toStrictEqual(`AA`);
        expect(contrast[testFunc](4.6)).toStrictEqual(`AA+`);
        expect(contrast[testFunc](7)).toStrictEqual(`AAA`);
        expect(contrast[testFunc](7.1)).toStrictEqual(`AAA+`);
      });
    });
  })();

  describe(`#getContrastRatio`, () => {
    it(`Works for getContrastRatio`, () => {
      expect(getContrastRatio([0.1, 0.15])).toStrictEqual(1.3333333333333333);
    });
  });
  describe(`#luminanceAboveCutoff`, () => {
    it(`Works for luminanceAboveCutoff`, () => {
      expect(contrast.luminanceAboveCutoff(0.1)).toBe(false);
    });
  });
  describe(`#luminanceAboveCutoff`, () => {
    it(`Works for luminanceAboveCutoff`, () => {
      expect(contrast.luminanceAboveCutoff(0.2)).toBe(true);
    });
  });
  describe(`#calculateMaxLuminance`, () => {
    it(`Works for calculateMaxLuminance`, () => {
      expect(contrast.calculateMaxLuminance(0.1, 1.3333333333333333)).toBeCloseTo(0.15);
    });
  });
  describe(`#calculateMinLuminance`, () => {
    it(`Works for calculateMinLuminance`, () => {
      expect(contrast.calculateMinLuminance(0.15, 1.3333333333333333)).toBeCloseTo(0.1);
    });
  });
  describe(`#luminanceToLinear`, () => {
    it(`Works for luminanceToLinear`, () => {
      expect(contrast.luminanceToLinear(1)).toBeCloseTo(1);
    });
  });
  describe(`#luminanceToLinear`, () => {
    it(`Works for luminanceToLinear`, () => {
      expect(contrast.luminanceToLinear(0.132868321553819)).toBeCloseTo(0.4);
    });
  });
  describe(`#luminanceToLinear`, () => {
    it(`Works for luminanceToLinear`, () => {
      expect(contrast.luminanceToLinear(0.6038273389)).toBeCloseTo(0.8);
    });
  });
}
