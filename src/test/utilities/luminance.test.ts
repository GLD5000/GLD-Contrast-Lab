import { describe, expect, it } from 'vitest';
import hexToLuminance, { luminance } from '../../utilities/colour/luminance';

(() => {
  const testFunc = 'convertSrgbToLuminance';
  const input = [1, 1, 1];
  const output = 1;
  describe(`#${testFunc}`, () => {
    it(`Works for ${input}`, () => {
      expect(luminance[testFunc](input)).toStrictEqual(output);
    });
  });
})();

(() => {
  const testFunc = 'convertSrgbToLuminance';
  const input = [0, 0, 0];
  const output = 0;
  describe(`#${testFunc}`, () => {
    it(`Works for ${input}`, () => {
      expect(luminance[testFunc](input)).toStrictEqual(output);
    });
  });
})();

(() => {
  const input = '#fff';
  const output = 1;
  describe(`#hexToLuminance`, () => {
    it(`Works for ${input}`, () => {
      expect(hexToLuminance(input)).toStrictEqual(output);
    });
  });
})();
