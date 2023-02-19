import hexToLuminance from './luminance';

const autoTextColour = {
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

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

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
}
