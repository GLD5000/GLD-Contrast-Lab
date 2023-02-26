import { describe, expect, it } from 'vitest';
import setToTargetContrast, { autoContrast } from '../../utilities/colour/autoContrast';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { luminance } from '../../utilities/colour/luminance';

(() => {
  const output = '#ffffff';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast `, () => {
      expect(setToTargetContrast('#000000', 25).resultingHex).toBe(output);
      expect(setToTargetContrast('#000000', 25).resultingContrastRatio).toBe(21);
    });
  });
})();

(() => {
  const output = '#000000';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast `, () => {
      expect(setToTargetContrast('#ffffff', 25, 'down').resultingHex).toBe(output);
      expect(setToTargetContrast('#ffffff', 25, 'down').resultingContrastRatio).toBeGreaterThan(20);
    });
  });
})();

(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast `, () => {
      expect(setToTargetContrast('#ff0fff', 5, 'down').resultingContrastRatio).toBe(5);
      expect(setToTargetContrast('#ff0fff', 10, 'down').resultingHex[5]).toBe('0');
      expect(setToTargetContrast('#ff0fff', 10, 'down').resultingHex).toBe('#000000');
    });
  });
})();

(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast `, () => {
      expect(setToTargetContrast('#a3e635 ', 5, 'up').resultingHex).toBe('#ffffff');
      expect(setToTargetContrast('#010101', 5, 'up').resultingContrastRatio).toBe(5);
      expect(setToTargetContrast('#010101', 10, 'up').resultingContrastRatio).toBe(10);
      expect(setToTargetContrast('#010101', 15, 'up').resultingContrastRatio).toBe(15);
      expect(setToTargetContrast('#010101', 20, 'up').resultingContrastRatio).toBe(20);
    });
  });
})();
(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast '#a3e635 ', 3, 'up' `, () => {
      expect(setToTargetContrast('#a3e635 ', 3, 'up').resultingContrastRatio).toBe(3);
    });
  });
})();
(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast '#a3e635 ', 3, 'down' `, () => {
      expect(setToTargetContrast('#a3e635 ', 3, 'down').resultingContrastRatio).toBe(3);
    });
  });
})();
(() => {
  const hex = '#779955';
  const ratio = 3.22;
  const direction = 'up';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBe(ratio);
    });
  });
})();

// Test down under
(() => {
  const direction = 'down';
  const resultingContrastRatio = 5;
  const targetContrast = 5.12;
  const resultingHex = '#6f6f6f';
  const resultingSrgb = colourSpace.getSrgbArrayFromHexString(resultingHex);
  const originalLuminance = 1;
  // const originalSrgb = [1, 1, 1];
  describe(`#setToTargetContrast`, () => {
    it(`Works for autoContrast.adjustResults ${resultingHex}, ${targetContrast}, ${direction} `, () => {
      expect(
        autoContrast.adjustResults({
          direction,
          resultingContrastRatio,
          targetContrast,
          resultingHex,
          resultingSrgb,
          originalLuminance,
          // originalSrgb,
        }).resultingContrastRatio,
      ).toBe(targetContrast);
    });
  });
})();
// test up over
(() => {
  const direction = 'up';
  const resultingContrastRatio = 2.22;
  const targetContrast = 2;
  const resultingHex = '#b2e57f';
  const resultingSrgb = colourSpace.getSrgbArrayFromHexString(resultingHex);
  const originalLuminance = luminance.convertHexToLuminance('#779955');
  // const originalSrgb = colourSpace.convertHexToSrgbArray('#779955');
  describe(`#setToTargetContrast`, () => {
    it(`Works for autoContrast.adjustResults ${resultingHex}, ${targetContrast}, ${direction} `, () => {
      expect(
        autoContrast.adjustResults({
          direction,
          resultingContrastRatio,
          targetContrast,
          resultingHex,
          resultingSrgb,
          originalLuminance,
          // originalSrgb,
        }).resultingContrastRatio,
      ).toBe(targetContrast);
    });
  });
})();

(() => {
  const hex = '#779955';
  const ratio = 2.22;
  const direction = 'up';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBe(ratio);
    });
  });
})();

(() => {
  const hex = '#770955';
  const ratio = 2.22;
  const direction = 'up';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBe(ratio);
    });
  });
})();

(() => {
  const hex = '#a709a5';
  const ratio = 2.22;
  const direction = 'down';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBe(ratio);
    });
  });
})();
