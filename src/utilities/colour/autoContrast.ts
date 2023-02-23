import { luminance } from './luminance';
import { colourSpace } from './colourSpace';
import { contrast } from './contrastRatio';

function getIncreasedLuminance(originalLuminance: number, targetContrast: number) {
  return Math.min(1, targetContrast * 1.000000001 * (originalLuminance + 0.05) - 0.05);
}
function getDecreasedLuminance(originalLuminance: number, targetContrast: number) {
  return Math.max(0, (-0.05 * targetContrast + originalLuminance + 0.05) / targetContrast);
}
function luminanceToLinear(luminanceIn: number) {
  return Math.min(1, Math.max(0, 1.055 * luminanceIn ** (1 / 2.4) - 0.055));
}
function applyLinearRatio(linearLumArray: Array<number>, originalSrgb: Array<number>, direction: string) {
  if (direction === 'up') {
    const maxSrgb = Math.max(1, Math.max(...originalSrgb) * 255);
    console.log(`maxSrgb ${maxSrgb}`);
    const maxRatio = 255 / maxSrgb;
    console.log(`maxRatio ${maxRatio}`);
    const l1 = Math.min(255, Math.max(...linearLumArray) * 255);
    console.log(`l1 ${l1}`);
    const l2 = Math.max(1, Math.min(...linearLumArray) * 255);
    console.log(`l2 ${l2}`);
    const calculatedRatio = l1 / l2;
    console.log(`calculatedRatio ${calculatedRatio}`);
    const returnRatio = Math.min(maxRatio, calculatedRatio);
    console.log(`returnRatio ${returnRatio}`);
    return originalSrgb.map((x) => (Math.max(1, x * 255) * returnRatio) / 255);
  }
  const minSrgb = Math.max(1, 255 * Math.min(...originalSrgb.filter((x) => x !== 0)));
  console.log(`minSrgb ${minSrgb}`);
  const minRatio = 1 / minSrgb;
  console.log(`minRatio ${minRatio}`);
  console.log(`linearLumArray ${linearLumArray}`);
  const l1 = Math.min(255, Math.max(...linearLumArray) * 255);
  console.log(`l1 ${l1}`);
  const l2 = Math.max(1, Math.min(...linearLumArray) * 255);
  console.log(`l2 ${l2}`);
  const calculatedRatio = 1 / (l1 / l2);
  console.log(`calculatedRatio ${calculatedRatio}`);
  if (calculatedRatio < minRatio && Math.min(...originalSrgb) === Math.max(...originalSrgb)) return [0, 0, 0]; // Allow black for neutral colours
  const returnRatio = Math.max(minRatio, calculatedRatio);
  console.log(`returnRatio ${returnRatio}`);
  return originalSrgb.map((x) => Math.max(0, (x * 255 * returnRatio) / 255));
}
function setToTargetLuminanceGreyScale(targetLuminance: number, originalLuminance: number) {
  const resultingSrgb = luminance.convertLuminanceToSrgb(targetLuminance);
  const resultingHex = colourSpace.convertSrgbToHex(resultingSrgb);
  const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
  const resultingContrastRatio = contrast.getContrastRatio2Dp([originalLuminance, resultingLuminance]);
  return { resultingHex, resultingContrastRatio };
}

export default function setToTargetContrast(
  originalHex: string,
  targetContrast: number,
  direction = 'up',
  oldTargetContrast: number | undefined = undefined,
): { resultingHex: string; resultingContrastRatio: number } {
  const testContrast = oldTargetContrast === undefined ? targetContrast : oldTargetContrast;
  const originalSrgb = colourSpace.convertHexToSrgbArray(originalHex);
  console.log(`originalSrgb ${originalSrgb}`);
  const originalLuminance = luminance.convertSrgbToLuminance(originalSrgb);
  console.log(`originalLuminance ${originalLuminance}`);
  const targetLuminance =
    direction === 'up'
      ? getIncreasedLuminance(originalLuminance, targetContrast)
      : getDecreasedLuminance(originalLuminance, targetContrast);
  console.log(`targetLuminance ${targetLuminance}`);
  if (Math.min(...originalSrgb) === Math.max(...originalSrgb))
    return setToTargetLuminanceGreyScale(targetLuminance, originalLuminance);

  const originalLinearLum = luminanceToLinear(originalLuminance);
  console.log(`originalLinearLum ${originalLinearLum}`);
  const targetLinearLum = luminanceToLinear(targetLuminance);
  console.log(`targetLinearLum ${targetLinearLum}`);

  const resultingSrgb = applyLinearRatio([targetLinearLum, originalLinearLum], originalSrgb, direction);
  console.log(`resultingSrgb ${resultingSrgb}`);
  const resultingHex = colourSpace.convertSrgbToHex(resultingSrgb);
  console.log(`resultingHex ${resultingHex}`);
  const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
  console.log(`resultingLuminance ${resultingLuminance}`);
  const resultingContrastRatio = contrast.getContrastRatio2Dp([originalLuminance, resultingLuminance]);
  console.log(`resultingContrastRatio ${resultingContrastRatio}`);
  if (resultingContrastRatio > testContrast + 0.1 && !resultingSrgb.includes(0) && !resultingSrgb.includes(1))
    return setToTargetContrast(
      originalHex,
      targetContrast * (targetContrast / resultingContrastRatio),
      direction,
      testContrast,
    );
  if (resultingContrastRatio < testContrast && !resultingSrgb.includes(0) && !resultingSrgb.includes(1))
    return setToTargetContrast(
      originalHex,
      targetContrast * (targetContrast / resultingContrastRatio),
      direction,
      testContrast,
    );
  return { resultingHex, resultingContrastRatio };
}
