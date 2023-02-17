const randomColour = {
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
  // convertHslToColourObject(hue: number, sat: number, lum: number, name: string) {
  //   return { name, hue, sat, lum };
  // },
  convertHslArrayToHex(hslArray: Array<number>) {
    const [hue] = hslArray;
    let [, sat, lum] = hslArray;

    sat /= 100;
    lum /= 100;

    const chroma = (1 - Math.abs(2 * lum - 1)) * sat;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const lightness = lum - chroma / 2;
    let red = 0;
    let green = 0;
    let blue = 0;

    if (hue >= 0 && hue < 60) {
      red = chroma;
      green = x;
      blue = 0;
    } else if (hue >= 60 && hue < 120) {
      red = x;
      green = chroma;
      blue = 0;
    } else if (hue >= 120 && hue < 180) {
      red = 0;
      green = chroma;
      blue = x;
    } else if (hue >= 180 && hue < 240) {
      red = 0;
      green = x;
      blue = chroma;
    } else if (hue >= 240 && hue < 300) {
      red = x;
      green = 0;
      blue = chroma;
    } else if (hue >= 300 && hue <= 360) {
      red = chroma;
      green = 0;
      blue = x;
    }
    // Having obtained RGB, convert channels to hex
    let hexRed = Math.round((red + lightness) * 255).toString(16);
    let hexGreen = Math.round((green + lightness) * 255).toString(16);
    let hexBlue = Math.round((blue + lightness) * 255).toString(16);

    // Prepend 0s, if necessary
    if (hexRed.length === 1) hexRed = `0${hexRed}`;
    if (hexGreen.length === 1) hexGreen = `0${hexGreen}`;
    if (hexBlue.length === 1) hexBlue = `0${hexBlue}`;
    const hex = `#${hexRed}${hexGreen}${hexBlue}`;
    return hex;
  },
  makeRandomHex() {
    const randomHsl = randomColour.makeRandomHslSafer();
    const randomHex = randomColour.convertHslArrayToHex(randomHsl);
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

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [0, 100, 50];
    const output = '#ff0000';
    describe(`#${testFunc}`, () => {
      it(`works for ${input}`, () => {
        expect(randomColour[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [0, 0, 0];
    const output = '#000000';
    describe(`#${testFunc}`, () => {
      it(`works for ${input}`, () => {
        expect(randomColour[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [220, 100, 50];
    const output = '#0055ff';
    describe(`#${testFunc}`, () => {
      it(`works for ${input}`, () => {
        expect((randomColour[testFunc](input))).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [260, 100, 50];
    const output = '#5500ff';
    describe(`#${testFunc}`, () => {
      it(`works for ${input}`, () => {
        expect(randomColour[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [320, 100, 50];
    const output = '#ff00aa';
    describe(`#${testFunc}`, () => {
      it(`works for ${input}`, () => {
        expect(randomColour[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [60, 100, 50];
    const output = '#ffff00';
    describe(`#${testFunc}`, () => {
      it(`works for ${input}`, () => {
        expect(randomColour[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [122, 100, 50];
    const output = '#00ff08';
    describe(`#${testFunc}`, () => {
      it(`works for ${input}`, () => {
        expect(randomColour[testFunc](input)).toStrictEqual(output);
      });
    });
  })();
}
