import { describe, expect, it } from 'vitest';
import setToTargetContrast from '../../utilities/colour/autoContrast';
import { colourSpace } from '../../utilities/colour/colourSpace';

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
      expect(setToTargetContrast('#ffffff', 25, 'down').resultingContrastRatio).toBeGreaterThanOrEqual(20);
    });
  });
})();

(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast `, () => {
      expect(setToTargetContrast('#ff0fff', 5, 'down').resultingContrastRatio).toBeGreaterThanOrEqual(5);
      expect(setToTargetContrast('#ff0fff', 10, 'down').resultingHex[5]).toBe('0');
      expect(setToTargetContrast('#ff0fff', 10, 'down').resultingHex).toBe('#000000');
    });
  });
})();

(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast `, () => {
      expect(setToTargetContrast('#a3e635 ', 5, 'up').resultingHex).toBe('#ffffff');
      expect(setToTargetContrast('#010101', 5, 'up').resultingContrastRatio).toBeGreaterThanOrEqual(5);
      expect(setToTargetContrast('#010101', 10, 'up').resultingContrastRatio).toBeGreaterThanOrEqual(10);
      expect(setToTargetContrast('#010101', 15, 'up').resultingContrastRatio).toBeGreaterThanOrEqual(15);
      expect(setToTargetContrast('#010101', 20, 'up').resultingContrastRatio).toBeGreaterThanOrEqual(20);
    });
  });
})();
(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast '#a3e635 ', 3, 'up' `, () => {
      expect(setToTargetContrast('#a3e635 ', 3, 'up').resultingContrastRatio).toBeGreaterThanOrEqual(3);
    });
  });
})();
(() => {
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast '#a3e635 ', 3, 'down' `, () => {
      expect(setToTargetContrast('#a3e635 ', 3, 'down').resultingContrastRatio).toBeGreaterThanOrEqual(3);
    });
  });
})();
(() => {
  const hex = '#779955';
  const ratio = 3.22;
  const direction = 'up';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBeGreaterThanOrEqual(ratio);
    });
  });
})();

(() => {
  const hex = '#779955';
  const ratio = 2.22;
  const direction = 'up';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBeGreaterThanOrEqual(ratio);
    });
  });
})();

(() => {
  const hex = '#770955';
  const ratio = 2.22;
  const direction = 'up';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBeGreaterThanOrEqual(ratio);
    });
  });
})();

(() => {
  const hex = '#a709a5';
  const ratio = 2.22;
  const direction = 'down';
  describe(`#setToTargetContrast`, () => {
    it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
      expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio).toBeGreaterThanOrEqual(ratio);
    });
  });
})();

for (let i = 0; i < 100; i += 1) {
  const hue = 3 * i;
  const sat = 100;
  const lum = 40;

  const hex = colourSpace.convertHslArrayToHex([hue, sat, lum]);
  (() => {
    const ratio = Math.floor(Math.random() * 3 + 1 * 100) / 100;
    // const ratio = 2.22;
    const direction = 'up';
    describe(`#setToTargetContrast`, () => {
      it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
        expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio.toFixed(2)).toBe(ratio.toFixed(2));
      });
    });
  })();
}

for (let i = 0; i < 100; i += 1) {
  const hue = 3 * i + 30;
  const sat = 100;
  const lum = 80;

  const hex = colourSpace.convertHslArrayToHex([hue, sat, lum]);
  (() => {
    const ratio = Math.floor(Math.random() * 3 + 1 * 100) / 100;
    // const ratio = 5.62;
    const direction = 'down';
    describe(`#setToTargetContrast`, () => {
      it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
        expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio.toFixed(2)).toBe(ratio.toFixed(2));
      });
    });
  })();
}

for (let i = 0; i < 4; i += 1) {
  const hue = 120 * i;
  const sat = 100;
  const lum = 50;

  const hex = colourSpace.convertHslArrayToHex([hue, sat, lum]);
  (() => {
    const ratio = Math.floor(Math.random() * 3 + 1 * 100) / 100;
    // const ratio = 5.62;
    const direction = 'down';
    describe(`#setToTargetContrast`, () => {
      it(`Works for setToTargetContrast ${hex}, ${ratio}, ${direction} `, () => {
        expect(setToTargetContrast(hex, ratio, direction).resultingContrastRatio.toFixed(2)).toBe(ratio.toFixed(2));
      });
    });
  })();
}
