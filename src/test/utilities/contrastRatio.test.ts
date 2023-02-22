import { describe, expect, it } from 'vitest';
import getContrastRatio, { contrast, getContrastRatioFromHex } from '../../utilities/colour/contrastRatio';

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
(() => {
  const testFunc = 'getContrastRatioFloat';
  describe(`#${testFunc}`, () => {
    it(`Works for range`, () => {
      expect(contrast[testFunc]([0.1, 0.15]).toFixed(2)).toStrictEqual('1.33');
    });
  });
})();
(() => {
  const testFunc = 'getContrastRatioFromHex';
  describe(`#${testFunc}`, () => {
    it(`Works for range`, () => {
      expect(getContrastRatioFromHex('#000000', '#ffffff').toFixed(2)).toStrictEqual('21.00');
    });
  });
})();

describe(`#getContrastRatio`, () => {
  it(`Works for getContrastRatio`, () => {
    expect(getContrastRatio([0.1, 0.15])).toStrictEqual(1.33);
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
