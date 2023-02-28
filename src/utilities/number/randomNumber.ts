export default function getRandomNumberBetween(args: number[], decimalPlaces = 0) {
  const min = Math.min(...args);
  const max = Math.max(...args) + 1;
  const random = Math.random() * max + min;
  if (decimalPlaces === 0) return random;
  const multiplier = 10 ** decimalPlaces;
  return Math.round(random * multiplier) / multiplier;
}
