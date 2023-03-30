import { luminance } from './luminance';
import { colourSpace } from './colourSpace';
import { contrast } from './contrastRatio';

export const autoContrast = {
  getIncreasedLuminance(originalLuminance: number, targetContrast: number) {
    return Math.min(1, targetContrast * 1.000000001 * (originalLuminance + 0.05) - 0.05);
  },
  getDecreasedLuminance(originalLuminance: number, targetContrast: number) {
    return Math.max(0, (-0.05 * targetContrast + originalLuminance + 0.05) / targetContrast);
  },
  luminanceToLinear(luminanceIn: number) {
    return Math.min(1, Math.max(0, 1.055 * luminanceIn ** (1 / 2.4) - 0.055));
  },
  getLinearRatio(target: number, original: number, weighting = 1) {
    if (weighting === 1) return target / original;

    const unweightedRatio = target / original;
    const greaterThanOne = unweightedRatio > 1;
    if (greaterThanOne) {
      return (unweightedRatio - 1) * weighting + 1;
    }

    return 1 - (1 - unweightedRatio) * weighting;
  },
  setToTargetLuminanceGreyScale(originalLuminance: number, targetLuminance: number, targetCr: number) {
    const resultingSrgb = luminance.convertLuminanceToSrgb(targetLuminance);
    const resultingHex = colourSpace.convertSrgbToHex(resultingSrgb);
    const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
    const resultingContrastRatio = contrast.getContrastRatio2Dp([originalLuminance, resultingLuminance]);
    const resultsAreGood = autoContrast.testResults(resultingHex, resultingContrastRatio, targetCr);
    if (resultsAreGood) return { resultingHex, resultingContrastRatio };
    return autoContrast.adjustLuminanceFine(targetCr, originalLuminance, targetLuminance, resultingSrgb);
  },
  multiplyLuminanceSrgb(array: Array<number>, factor: number) {
    const hslArray = colourSpace.convertSrgbToHslArray(array);
    hslArray[2] = Math.max(0, Math.min(100, hslArray[2] * factor));
    return colourSpace.convertHslArrayToSrgb(hslArray);
  },

  adjustLuminanceSrgb(array: Array<number>, increment: number) {
    const hslArray = colourSpace.convertSrgbToHslArray(array);
    hslArray[2] = Math.max(0, Math.min(100, hslArray[2] + increment));
    return colourSpace.convertHslArrayToSrgb(hslArray);
  },

  getResults(resultingSrgb: number[], originalLuminance: number) {
    const resultingHex = colourSpace.convertSrgbToHex(resultingSrgb);
    const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
    const resultingContrastRatio = contrast.getContrastRatio2Dp([originalLuminance, resultingLuminance]);
    return { resultingContrastRatio, resultingHex };
  },

  multiplySrgbRatio(originalSrgb: number[], linearRatio: number) {
    return originalSrgb.map((x) => {
      if (x > 0) return Math.max(0, Math.min(1, x * linearRatio));
      return x;
    });
  },
  getResultingSrgb(originalLuminance: number, targetLuminance: number, originalSrgb: number[]) {
    const linearRatio = autoContrast.luminancesToLinearRatio(originalLuminance, targetLuminance);
    const resultingSrgb = autoContrast.multiplySrgbRatio(originalSrgb, linearRatio);
    return resultingSrgb;
  },

  luminancesToLinearRatio(originalLuminance: number, targetLuminance: number, weighting = 1) {
    const originalLinearLum = autoContrast.luminanceToLinear(originalLuminance);
    const targetLinearLum = autoContrast.luminanceToLinear(targetLuminance);
    const linearRatio = autoContrast.getLinearRatio(targetLinearLum, originalLinearLum, weighting);
    return linearRatio;
  },

  getLuminances(originalSrgb: number[], direction: string, targetContrast: number) {
    const originalLuminance = luminance.convertSrgbToLuminance(originalSrgb);
    const targetLuminance = autoContrast.getTargetLuminance(direction, originalLuminance, targetContrast);
    return { targetLuminance, originalLuminance };
  },

  getTargetLuminance(direction: string, originalLuminance: number, targetContrast: number) {
    return direction === 'up'
      ? autoContrast.getIncreasedLuminance(originalLuminance, targetContrast)
      : autoContrast.getDecreasedLuminance(originalLuminance, targetContrast);
  },
  adjustLuminanceWeighted(
    targetContrast: number,
    originalLuminance: number,
    targetLuminance: number,
    resultingSrgb: number[],
  ) {
    const weighting = luminance.getLuminanceWeighting(resultingSrgb);
    let loopLimiter = 0;
    const loopLimit = 10;
    let currentSrgb = resultingSrgb;
    let currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
    let currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);

    let equal = false;
    while (loopLimiter < loopLimit && equal === false) {
      loopLimiter += 1;
      const ratio = autoContrast.luminancesToLinearRatio(currentLuminance, targetLuminance, weighting);
      currentSrgb = autoContrast.multiplyLuminanceSrgb(currentSrgb, ratio);
      currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
      currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);

      equal = currentContrast === targetContrast;
    }
    let { resultingContrastRatio, resultingHex } = autoContrast.getResults(currentSrgb, originalLuminance);
    const resultsAreGood = autoContrast.testResults(resultingHex, resultingContrastRatio, targetContrast);
    if (resultsAreGood) return { resultingContrastRatio, resultingHex };
    ({ resultingContrastRatio, resultingHex } = autoContrast.adjustLuminanceFine(
      targetContrast,
      originalLuminance,
      targetLuminance,
      currentSrgb,
    ));
    return { resultingContrastRatio, resultingHex };
  },
  srgbIsWithinLimit(decimalArray: number[]) {
    const total = decimalArray.reduce((a: number, b: number) => a + b);
    return total > 0 && total < 3;
  },
  hslIsWithinLimit(arrayIn: number[]) {
    return arrayIn[2] > 0 && arrayIn[2] < 100;
  },
  adjustLuminanceFine(
    targetContrast: number,
    originalLuminance: number,
    targetLuminance: number,
    resultingSrgb: number[],
  ) {
    const originalDirection = originalLuminance < targetLuminance ? 'up' : 'down';
    let loopLimiter = 0;
    const loopLimit = 25;
    let currentSrgb = resultingSrgb;
    let currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
    let currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);
    let equal = false;

    let directionUp = currentContrast < targetContrast;
    const startIncrement = 10;
    let changesOfDirection = 0;
    let outOfBounds = 0;
    let changesMultipier = 1;
    let inRightDirection = false;

    while (loopLimiter < loopLimit && equal === false && outOfBounds < 3) {
      const increment = directionUp ? changesMultipier * startIncrement : changesMultipier * startIncrement * -1;
      loopLimiter += 1;
      currentSrgb = autoContrast.adjustLuminanceSrgb(currentSrgb, increment);
      currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
      currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);
      inRightDirection =
        originalDirection === 'up' ? currentLuminance > originalLuminance : currentLuminance < originalLuminance;
      equal = inRightDirection && targetContrast === currentContrast;
      if (directionUp !== currentLuminance < targetLuminance) {
        directionUp = !directionUp;
        changesOfDirection += 1;
      }
      changesMultipier = 1 / Math.max(1, 2 ** changesOfDirection);
      const inBounds = autoContrast.srgbIsWithinLimit(currentSrgb);
      if (inBounds) {
        outOfBounds = 0;
      }

      if (!inBounds) {
        outOfBounds += 1;
      }
    }
    // if (loopLimiter === loopLimit) console.log('loopLimiter:', loopLimiter);
    const { resultingContrastRatio, resultingHex } = autoContrast.getResults(currentSrgb, originalLuminance);
    const resultsAreGood = autoContrast.testResults(resultingHex, resultingContrastRatio, targetContrast);
    if (resultsAreGood) return { resultingContrastRatio, resultingHex };
    return { resultingContrastRatio, resultingHex, resultsAreGood };
  },
  adjustLuminanceFineHsl(originalHsl: number[], targetLuminance: number) {
    const originalLuminance = luminance.convertHslToLuminance(originalHsl);
    const targetContrast = contrast.getContrastRatioFloat([targetLuminance, originalLuminance]);

    const originalDirection = originalLuminance < targetLuminance ? 'up' : 'down';
    let loopLimiter = 0;
    const loopLimit = 20;
    let currentHsl = originalHsl;
    let currentLuminance = originalLuminance;
    let currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);
    let equal = false;

    let directionUp = currentContrast < targetContrast;
    const targetContrast2dp = Math.floor(targetContrast * 100) / 100;
    const startIncrement = 10;
    let changesOfDirection = 0;
    let outOfBounds = 0;
    let changesMultipier = 1;
    let inRightDirection = false;

    while (loopLimiter < loopLimit && equal === false && outOfBounds < 3) {
      const increment = directionUp ? changesMultipier * startIncrement : changesMultipier * startIncrement * -1;
      loopLimiter += 1;
      currentHsl = autoContrast.incrementLuminanceHsl(currentHsl, increment);
      currentLuminance = luminance.convertHslToLuminance(currentHsl);
      currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);
      inRightDirection =
        originalDirection === 'up' ? currentLuminance > originalLuminance : currentLuminance < originalLuminance;
      equal = inRightDirection && currentContrast === targetContrast2dp;
      // if (equal === true) console.log(inRightDirection, currentContrast, targetContrast2dp);
      if (directionUp !== currentLuminance < targetLuminance) {
        directionUp = !directionUp;
        changesOfDirection += 1;
      }
      changesMultipier = 1 / Math.max(1, 2 ** changesOfDirection);
      const inBounds = autoContrast.hslIsWithinLimit(currentHsl);
      if (inBounds) {
        outOfBounds = 0;
      }

      if (!inBounds) {
        outOfBounds += 1;
      }
    }
    const resultingContrastRatio = contrast.getContrastRatio2Dp([
      originalLuminance,
      luminance.convertHslToLuminance(currentHsl),
    ]);
    if (loopLimiter === loopLimit)
      console.log('loopLimiter:', loopLimiter, resultingContrastRatio, targetContrast2dp, inRightDirection, equal);
    const resultsAreGood = autoContrast.testResultsHsl(currentHsl, resultingContrastRatio, targetContrast);
    if (resultsAreGood) return { resultingContrastRatio, resultingHsl: currentHsl, resultsAreGood };
    return { resultingContrastRatio, resultingHsl: currentHsl, resultsAreGood };
  },
  testResults(hex: string, contrastA: number, contrastB: number) {
    const boolean = hex === '#000000' || hex === '#ffffff' || contrastA === contrastB;
    return boolean;
  },
  testResultsHsl(hsl: number[], contrastA: number, contrastB: number) {
    const boolean = hsl[2] === 0 || hsl[2] === 100 || contrastA === contrastB;
    return boolean;
  },

  incrementLuminanceHsl(hslArray: Array<number>, increment: number) {
    const copy = [...hslArray];
    copy[2] = Math.max(0, Math.min(100, hslArray[2] + increment));
    return copy;
  },
};

export default function setToTargetContrast(
  originalHex: string,
  targetContrast: number,
  direction = 'up',
): { resultingHex: string; resultingContrastRatio: number } {
  const bufferedTargetContrast = targetContrast;
  const originalSrgb = colourSpace.convertHexToSrgbArray(originalHex);
  const { targetLuminance, originalLuminance } = autoContrast.getLuminances(
    originalSrgb,
    direction,
    bufferedTargetContrast,
  );
  const isGreyscale =
    targetLuminance === 1 || targetLuminance === 0 || Math.min(...originalSrgb) === Math.max(...originalSrgb);
  if (isGreyscale)
    return autoContrast.setToTargetLuminanceGreyScale(originalLuminance, targetLuminance, targetContrast);

  const resultingSrgb = autoContrast.getResultingSrgb(originalLuminance, targetLuminance, originalSrgb);
  const { resultingContrastRatio, resultingHex } = autoContrast.getResults(resultingSrgb, originalLuminance);
  const resultsAreGood = autoContrast.testResults(resultingHex, resultingContrastRatio, targetContrast);
  if (resultsAreGood) {
    return { resultingHex, resultingContrastRatio };
  }
  return autoContrast.adjustLuminanceWeighted(
    bufferedTargetContrast,
    originalLuminance,
    targetLuminance,
    resultingSrgb,
  );
}

export function setToTargetLuminance(
  originalHex: string,
  targetLuminance: number,
): { resultingHex: string; resultingContrastRatio: number } {
  const originalLuminance = luminance.convertHexToLuminance(originalHex);
  const originalSrgb = colourSpace.convertHexToSrgbArray(originalHex);
  const targetContrast = contrast.getContrastRatioFloat([targetLuminance, originalLuminance]);
  // const newDirection = originalLuminance < targetLuminance ? 'up' : 'down';
  return autoContrast.adjustLuminanceFine(targetContrast, originalLuminance, targetLuminance, originalSrgb);
}

export function setToTargetLuminanceHsl(originalHsl: number[], targetLuminance: number) {
  return autoContrast.adjustLuminanceFineHsl(originalHsl, targetLuminance);
}
