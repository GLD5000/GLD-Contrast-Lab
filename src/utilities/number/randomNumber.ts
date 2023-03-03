export default function getRandomNumberBetween(args: number[], decimalPlaces = 0) {
  const min = Math.min(...args);
  const max = Math.max(1, Math.max(...args) - min);
  const random = Math.random() * max + min;
  if (decimalPlaces === 0) return Math.round(random);
  const multiplier = 10 ** decimalPlaces;
  return Math.round(random * multiplier) / multiplier;
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('#getRandomNumberBetween', () => {
    it('Number within range', () => {
      expect(getRandomNumberBetween([1, 2])).toMatch(/^[1-2]$/);
    });
  });

  describe('#getRandomNumberBetween', () => {
    it('Number within range', () => {
      expect(getRandomNumberBetween([1, 5], 3)).toMatch(/^[1-5].[0-9]{0,3}$/);
    });
  });

  describe('#getRandomNumberBetween', () => {
    it('Number within range', () => {
      expect(getRandomNumberBetween([5], 3)).toMatch(/^5.[0-9]{0,3}$/);
    });
  });
}
