import { describe, expect, it } from 'vitest';
import autoTextColourFromHex, { autoTextColour } from '../../utilities/colour/autoTextColour';

(() => {
  const testFunc = 'backgroundLuminanceToTextColour';
  const input = 1;
  const output = '#000000';
  describe(`#${testFunc}`, () => {
    it(`Works for ${input}`, () => {
      expect(autoTextColour[testFunc](input)).toStrictEqual(output);
    });
  });
})();

(() => {
  const testFunc = 'autoTextColourFromHex';
  const input = '#000000';
  const output = '#ffffff';
  describe(`#${testFunc}`, () => {
    it(`Works for ${input}`, () => {
      expect(autoTextColour[testFunc](input)).toStrictEqual(output);
    });
  });
})();

(() => {
  const testFunc = 'autoTextColour';
  const input = '#000000';
  const output = '#ffffff';
  describe(`#${testFunc}`, () => {
    it(`Works for ${input}`, () => {
      expect(autoTextColourFromHex(input)).toStrictEqual(output);
    });
  });
})();
