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
function getLinearRatio(target: number, original: number) {
  return target / original;
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
): { resultingHex: string; resultingContrastRatio: number } {
  const originalSrgb = colourSpace.convertHexToSrgbArray(originalHex);
  const originalLuminance = luminance.convertSrgbToLuminance(originalSrgb);
  const targetLuminance =
    direction === 'up'
      ? getIncreasedLuminance(originalLuminance, targetContrast)
      : getDecreasedLuminance(originalLuminance, targetContrast);

  if (targetLuminance === 1 || targetLuminance === 0 || Math.min(...originalSrgb) === Math.max(...originalSrgb))
    return setToTargetLuminanceGreyScale(targetLuminance, originalLuminance);
  const originalLinearLum = luminanceToLinear(originalLuminance);
  const targetLinearLum = luminanceToLinear(targetLuminance);
  const linearRatio = getLinearRatio(targetLinearLum, originalLinearLum);
  let resultingSrgb = multiplySrgbRatio(originalSrgb, linearRatio);
  // const resultingSrgb = applyLinearRatio([targetLinearLum, originalLinearLum], originalSrgb, direction);
  let { resultingLuminance, resultingContrastRatio, resultingHex } = getResults(resultingSrgb, originalLuminance);

  do {
    resultingSrgb = multiplySrgbRatio(resultingSrgb, getLinearRatio(resultingContrastRatio, targetContrast));
    const results = getResults(resultingSrgb, originalLuminance);
    console.log(getLinearRatio(resultingContrastRatio, targetContrast));

    console.log(results);

    resultingLuminance = results.resultingLuminance;
    resultingContrastRatio = results.resultingContrastRatio;
    resultingHex = results.resultingHex;
  } while (resultingLuminance > 0 && resultingLuminance < 1 && resultingContrastRatio > targetContrast);
  if (resultingContrastRatio < targetContrast) console.log(resultingHex);
  // if (
  //   resultingLuminance > 0 &&
  //   resultingLuminance < 1 &&
  //   (resultingContrastRatio < targetContrast || resultingContrastRatio > targetContrast + 0.1)
  // ) {
  //   resultingSrgb = multiplySrgbRatio(resultingSrgb, getLinearRatio(resultingContrastRatio,targetContrast));
  //   const results = getResults(resultingSrgb, originalLuminance);
  //   console.log(getLinearRatio(resultingContrastRatio,targetContrast));

  //   console.log(results);

  //   resultingLuminance = results.resultingLuminance;
  //   resultingContrastRatio = results.resultingContrastRatio;
  //   resultingHex = results.resultingHex;
  // }
  // if (
  //   resultingLuminance > 0 &&
  //   resultingLuminance < 1 &&
  //   (resultingContrastRatio < targetContrast || resultingContrastRatio > targetContrast + 0.1)
  // ) {
  //   resultingSrgb = multiplySrgbRatio(resultingSrgb, getLinearRatio(resultingContrastRatio,targetContrast));
  //   const results = getResults(resultingSrgb, originalLuminance);
  //   console.log(getLinearRatio(resultingContrastRatio,targetContrast));

  //   console.log(results);

  //   resultingLuminance = results.resultingLuminance;
  //   resultingContrastRatio = results.resultingContrastRatio;
  //   resultingHex = results.resultingHex;
  // }
  return { resultingHex, resultingContrastRatio };
}
function getResults(resultingSrgb: number[], originalLuminance: number) {
  const resultingHex = colourSpace.convertSrgbToHex(resultingSrgb);
  const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
  const resultingContrastRatio = contrast.getContrastRatio2Dp([originalLuminance, resultingLuminance]);
  return { resultingLuminance, resultingContrastRatio, resultingHex };
}

function multiplySrgbRatio(originalSrgb: number[], linearRatio: number) {
  return originalSrgb.map((x) => {
    if (x > 0) return x * linearRatio;
    return x;
  });
}
