import { describe, expect, it } from 'vitest';
import setToTargetContrast from '../../utilities/colour/autoContrast';

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
