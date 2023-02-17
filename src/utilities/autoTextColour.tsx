const colourspace = {
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
    const splitHex = colourspace.splitHexString(hex);
    return splitHex.map((digits) => colourspace.hexDigitsToDecimal(digits));
  },
  convertHexToSrgbArray(hexIn: string) {
    const srgbArray = colourspace.getSrgbArrayFromHexString(hexIn);
    return srgbArray;
  },
  constrainSrgbArray(arrayIn: Array<number>) {
    return arrayIn.map((x) => Math.min(1, Math.max(0, x)));
  },

  convertSrgbToHslArray(srgbArray: Array<number>) {
    const [red, green, blue] = colourspace.constrainSrgbArray(srgbArray);

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
  convertSrgbToHex(srgbArray: Array<number>) {
    return this.convertHslArrayToHex(this.convertSrgbToHslArray(srgbArray));
  },
  convertSrgbToLuminance(args: Array<number>) {
    function modifyColourValue(value: number) {
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }
    function sumColourValues(R: number, G: number, B: number) {
      const redMult = 0.2126;
      const greenMult = 0.7152;
      const blueMult = 0.0722;
      return redMult * R + greenMult * G + blueMult * B;
    }

    const [R, G, B] = args.map(modifyColourValue);
    const summed = sumColourValues(R, G, B);
    return summed;
  },

  convertHexToLuminance(hex: string) {
    const srgbArray = this.convertHexToSrgbArray(hex);
    const luminance = this.convertSrgbToLuminance(srgbArray);
    return luminance;
  },
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
    const backgroundLuminance = colourspace.convertHexToLuminance(hex);
    const textColour = colourspace.backgroundLuminanceToTextColour(backgroundLuminance);
    return textColour;
  },
};

export default function autoTextColour(hex: string) {
  return colourspace.autoTextColourFromHex(hex);
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('#splitHexString', () => {
    it('Split white hex', () => {
      expect(colourspace.splitHexString('#fff')).toStrictEqual([
        ['f', 'f'],
        ['f', 'f'],
        ['f', 'f'],
      ]);
    });
  });
  describe('#hexDigitsToDecimal', () => {
    it('white hex digits', () => {
      expect(colourspace.hexDigitsToDecimal(['f', 'f'])).toBe(1);
    });
  });
  describe('#hexDigitsToDecimal', () => {
    it('white hex digits', () => {
      expect(colourspace.hexDigitsToDecimal(['f'])).toBe(1);
    });
  });

  describe('#convertHexToSrgbArray', () => {
    it('Works for black', () => {
      expect(colourspace.convertHexToSrgbArray('#000')).toStrictEqual([0, 0, 0]);
    });
  });

  describe('#convertHexToSrgbArray', () => {
    it('Works for blue', () => {
      expect(colourspace.convertHexToSrgbArray('#0000Ff')).toStrictEqual([0, 0, 1]);
    });
  });

  describe('#convertHexToSrgbArray', () => {
    it('Works for white', () => {
      expect(colourspace.convertHexToSrgbArray('#ffffff')).toStrictEqual([1, 1, 1]);
    });
  });

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [1, 1, 1];
    const output = [0, 0, 100];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0, 0, 0];
    const output = [0, 0, 0];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [1, 0, 0];
    const output = [0, 100, 50];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [1.1, 0, 0];
    const output = [0, 100, 50];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0.1, 0.1, 0.1];
    const output = [0, 0, 10];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0.1, 0, 0];
    const output = [0, 100, 5];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHslArray';
    const input = [0, 0, 1];
    const output = [240, 100, 50];
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [0, 100, 50];
    const output = '#ff0000';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [0, 0, 0];
    const output = '#000000';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [220, 100, 50];
    const output = '#0055ff';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [260, 100, 50];
    const output = '#5500ff';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHslArrayToHex';
    const input = [320, 100, 50];
    const output = '#ff00aa';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHex';
    const input = [0, 0, 0];
    const output = '#000000';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHex';
    const input = [0, 1, 0];
    const output = '#00ff00';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToHex';
    const input = [1, 1, 0];
    const output = '#ffff00';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToLuminance';
    const input = [1, 1, 1];
    const output = 1;
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertSrgbToLuminance';
    const input = [0, 0, 0];
    const output = 0;
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'convertHexToLuminance';
    const input = '#fff';
    const output = 1;
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'backgroundLuminanceToTextColour';
    const input = 1;
    const output = '#000000';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'autoTextColourFromHex';
    const input = '#000000';
    const output = '#ffffff';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(colourspace[testFunc](input)).toStrictEqual(output);
      });
    });
  })();

  (() => {
    const testFunc = 'autoTextColour';
    const input = '#000000';
    const output = '#ffffff';
    describe(`#${testFunc}`, () => {
      it(`Works for ${input}`, () => {
        expect(autoTextColour(input)).toStrictEqual(output);
      });
    });
  })();
}
