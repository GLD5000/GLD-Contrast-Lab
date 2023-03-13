import { colourSpace } from './colourSpace';

export const randomColour = {
  randomIntegerInRange(start: number, end: number): number {
    return start + Math.floor(Math.random() * (end - start));
  },
  makeRandomHsl(): Array<number> {
    const hue = Math.floor(Math.random() * 360);
    const sat = 48 + Math.floor(Math.random() * 40); // 48 - 87
    const lum = 63 + Math.floor(Math.random() * 25); // 63 - 88
    return [hue, sat, lum];
  },
  makeRandomHslSafer(): Array<number> {
    const hue = randomColour.randomIntegerInRange(0, 360);
    const sat = randomColour.randomIntegerInRange(60, 90);
    const lum = randomColour.randomIntegerInRange(70, 90);
    return [hue, sat, lum];
  },
  makeRandomHslString() {
    const [hue, sat, lum] = randomColour.makeRandomHslSafer();
    return `HSL(${hue}, ${sat}%, ${lum}%)`;
  },
  makeRandomHex() {
    const randomHsl = randomColour.makeRandomHslSafer();
    const randomHex = colourSpace.convertHslArrayToHex(randomHsl);
    return randomHex;
  },
};
export default function getRandomColour() {
  const randomHex = randomColour.makeRandomHex();
  return randomHex;
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  (() => {
    const testFunc = 'makeRandomHsl';
    describe(`#${testFunc}`, () => {
      it(`Get random hsl array`, () => {
        expect(randomColour[testFunc]()[0]).toBeLessThanOrEqual(360);
        expect(randomColour[testFunc]()[0]).toBeGreaterThanOrEqual(0);
        expect(randomColour[testFunc]()[1]).toBeLessThanOrEqual(100);
        expect(randomColour[testFunc]()[1]).toBeGreaterThanOrEqual(0);
        expect(randomColour[testFunc]()[2]).toBeLessThanOrEqual(100);
        expect(randomColour[testFunc]()[2]).toBeGreaterThanOrEqual(0);
      });
    });
  })();

  (() => {
    const testFunc = 'getRandomColour';
    const output = /^#[0-9a-f]{6}$/;
    describe(`#${testFunc}`, () => {
      it(`gets random colour`, () => {
        expect(getRandomColour()).toMatch(output);
      });
    });
  })();
}
