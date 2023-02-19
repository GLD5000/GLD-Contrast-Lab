import hexToSrgb from './colourSpace';

const luminance = {
  modifyColourValue(value: number) {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  },
  sumColourValues(R: number, G: number, B: number) {
    const redMult = 0.2126;
    const greenMult = 0.7152;
    const blueMult = 0.0722;
    return redMult * R + greenMult * G + blueMult * B;
  },
  convertSrgbToLuminance(args: Array<number>) {
    const [R, G, B] = args.map(luminance.modifyColourValue);
    const summed = luminance.sumColourValues(R, G, B);
    return summed;
  },

  convertHexToLuminance(hex: string) {
    const srgbArray = hexToSrgb(hex);
    const luminanceResult = this.convertSrgbToLuminance(srgbArray);
    return luminanceResult;
  },
};

export default function hexToLuminance(hex: string) {
  return luminance.convertHexToLuminance(hex);
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

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
}
