export const colourSpace = {
  splitHexString(string: string) {
    return string.length === 7
      ? [
          [string[1], string[2]],
          [string[3], string[4]],
          [string[5], string[6]],
        ]
      : [
          [string[1], string[1]],
          [string[2], string[2]],
          [string[3], string[3]],
        ];
  },
  hexDigitsToDecimal(digits: Array<string>) {
    const converted = parseInt(`${digits[0]}${digits[1] || digits[0]}`, 16);
    return converted / 255;
  },
  getSrgbArrayFromHexString(hex: string) {
    const splitHex = colourSpace.splitHexString(hex);
    return splitHex.map((digits) => colourSpace.hexDigitsToDecimal(digits));
  },
  convertHexToSrgbArray(hexIn: string) {
    const srgbArray = colourSpace.getSrgbArrayFromHexString(hexIn);
    return srgbArray;
  },
  constrainSrgbArray(arrayIn: Array<number>) {
    return arrayIn.map((x) => Math.min(1, Math.max(0, x)));
  },

  convertSrgbToHslArray(srgbArray: Array<number>) {
    const [red, green, blue] = colourSpace.constrainSrgbArray(srgbArray);

    const cMin = Math.min(red, green, blue);
    const cMax = Math.max(red, green, blue);
    const delta = cMax - cMin;
    let hue = 0;
    let sat = 0;
    let lum = 0;
    console.log(cMin, cMax, delta);
    if (delta === 0) hue = 0;
    else if (cMax === red) hue = ((green - blue) / delta) % 6;
    else if (cMax === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;

    hue *= 60;

    lum = (cMax + cMin) / 2;
    sat = Math.max(0, Math.min(1, delta === 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1))));
    console.log(`sat ${sat}`);
    sat = +(sat * 100);
    console.log(`sat ${sat}`);
    lum = +(lum * 100);
    const hslArray = [hue, sat, lum];

    return hslArray;
  },
  convertHslArrayToHex(hslArray: Array<number>) {
    const constrainedArray = colourSpace.constrainHslArray(hslArray);
    const [hue] = constrainedArray;
    let [, sat, lum] = constrainedArray;

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
  convertSrgbToHex(srgbArray: Array<number>) {
    return this.convertHslArrayToHex(this.convertSrgbToHslArray(srgbArray));
  },

  constrainNumber(inputNumber = 0, min = 0, max = 100) {
    return Math.min(max, Math.max(min, inputNumber));
  },
  constrainHslArray(arrayInput: Array<number>) {
    return arrayInput.map((x, i) => {
      if (i === 0) return colourSpace.constrainNumber(x, 0, 360);
      return colourSpace.constrainNumber(x);
    });
  },
};
export default function hexToSrgb(hex: string) {
  return colourSpace.convertHexToSrgbArray(hex);
}
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('#splitHexString', () => {
    it('Split white hex', () => {
      expect(colourSpace.splitHexString('#fff')).toStrictEqual([
        ['f', 'f'],
        ['f', 'f'],
        ['f', 'f'],
      ]);
    });
  });
  describe('#splitHexString', () => {
    it('Split white hex', () => {
      expect(colourSpace.splitHexString('#ffffff')).toStrictEqual([
        ['f', 'f'],
        ['f', 'f'],
        ['f', 'f'],
      ]);
    });
  });
  describe('#hexDigitsToDecimal', () => {
    it('white hex digits', () => {
      expect(colourSpace.hexDigitsToDecimal(['f', 'f'])).toBe(1);
    });
  });
  describe('#hexDigitsToDecimal', () => {
    it('white hex digits', () => {
      expect(colourSpace.hexDigitsToDecimal(['f'])).toBe(1);
    });
  });

  describe('#convertHexToSrgbArray', () => {
    it('Works for black', () => {
      expect(hexToSrgb('#000')).toStrictEqual([0, 0, 0]);
    });
  });

  describe('#convertHexToSrgbArray', () => {
    it('Works for black', () => {
      expect(colourSpace.convertHexToSrgbArray('#000')).toStrictEqual([0, 0, 0]);
    });
  });

  describe('#convertHexToSrgbArray', () => {
    it('Works for blue', () => {
      expect(colourSpace.convertHexToSrgbArray('#0000Ff')).toStrictEqual([0, 0, 1]);
    });
  });

  describe('#convertHexToSrgbArray', () => {
    it('Works for white', () => {
      expect(colourSpace.convertHexToSrgbArray('#ffffff')).toStrictEqual([1, 1, 1]);
    });
  });
  describe('#hexToSrgb', () => {
    it('Works for white', () => {
      expect(hexToSrgb('#ffffff')).toStrictEqual([1, 1, 1]);
    });
  });

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [1, 1, 1];
    const output = [0, 0, 100];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0, 0, 0];
    const output = [0, 0, 0];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [1, 0, 0];
    const output = [0, 100, 50];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [1.1, 0, 0];
    const output = [0, 100, 50];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0.1, 0.1, 0.1];
    const output = [0, 0, 10];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0.1, 0, 0];
    const output = [0, 100, 5];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0, 0, 1];
    const output = [240, 100, 50];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [0, 100, 50];
    const output = '#ff0000';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [0, 0, 0];
    const output = '#000000';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [220, 100, 50];
    const output = '#0055ff';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [260, 100, 50];
    const output = '#5500ff';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [320, 100, 50];
    const output = '#ff00aa';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHex';
    const input = [0, 0, 0];
    const output = '#000000';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHex';
    const input = [0, 1, 0];
    const output = '#00ff00';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHex';
    const input = [1, 1, 0];
    const output = '#ffff00';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourSpace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();
}
