import { describe, expect, it } from 'vitest';
import hexToSrgb, { colourSpace } from '../../utilities/colour/colourSpace';

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
