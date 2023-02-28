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
  setToTargetLuminanceGreyScale(targetLuminance: number, originalLuminance: number) {
    const resultingSrgb = luminance.convertLuminanceToSrgb(targetLuminance);
    const resultingHex = colourSpace.convertSrgbToHex(resultingSrgb);
    const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
    const resultingContrastRatio = contrast.getContrastRatio2Dp([originalLuminance, resultingLuminance]);
    // console.log(resultingHex, resultingContrastRatio);
    return { resultingHex, resultingContrastRatio };
  },
  decrementLuminance(array: Array<number>) {
    const copyArray = [...array];
    copyArray[2] -= 0.5;
    return copyArray;
  },
  multiplyLuminance(array: Array<number>, factor: number) {
    const copyArray = [...array];
    copyArray[2] = Math.max(0, Math.min(100, copyArray[2] * factor));
    return copyArray;
  },
  multiplyLuminanceSrgb(array: Array<number>, factor: number) {
    const hslArray = colourSpace.convertSrgbToHslArray(array);
    // //console.log('hue:', hslArray[0]);
    // console.log('lum:', hslArray[2]);
    hslArray[2] = Math.max(0, Math.min(100, hslArray[2] * factor));
    return colourSpace.convertHslArrayToSrgb(hslArray);
  },

  adjustLuminanceSrgb(array: Array<number>, increment: number) {
    const hslArray = colourSpace.convertSrgbToHslArray(array);
    // //console.log('hue:', hslArray[0]);
    // console.log('lum:', hslArray[2]);
    hslArray[2] = Math.max(0, Math.min(100, hslArray[2] + increment));
    return colourSpace.convertHslArrayToSrgb(hslArray);
  },

  adjustResults({
    direction,
    resultingContrastRatio,
    bufferedTargetContrast,
    resultingHex,
    resultingSrgb,
    originalLuminance,
  }: // originalSrgb,
  {
    direction: string;
    resultingContrastRatio: number;
    bufferedTargetContrast: number;
    resultingHex: string;
    resultingSrgb: number[];
    originalLuminance: number;
    // originalSrgb: Array<number>;
  }): { resultingContrastRatio: number; resultingHex: string } {
    let run = 0;
    let assignableResultingContrastRatio = resultingContrastRatio;
    let assignableResultingHex = resultingHex;
    let assignableResultingSrgb = resultingSrgb;
    while (
      direction === 'up' &&
      assignableResultingContrastRatio > bufferedTargetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 25
    ) {
      // console.log(
      //   'direction',
      //   direction,
      //   'Over',
      //   assignableResultingContrastRatio,
      //   autoContrast.getLinearRatio(bufferedTargetContrast, assignableResultingContrastRatio),
      // );
      run += 1;
      // const newHsl = autoContrast.decrementLuminance(hsl);
      // const hsl = colourSpace.convertSrgbToHslArray(assignableResultingSrgb);
      // const newHsl = autoContrast.multiplyLuminance(hsl, newRatio);
      // //console.log(hsl);
      // //console.log(newHsl);
      // assignableResultingSrgb = colourSpace.convertHslArrayToSrgb(newHsl);

      const newAssignableResultingSrgb = getNewSrgb(
        bufferedTargetContrast,
        assignableResultingContrastRatio,
        resultingSrgb,
        direction,
      );
      // assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      // //console.log(assignableResultingSrgb);
      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(newAssignableResultingSrgb, originalLuminance));
      // console.log('direction', direction, 'Over', assignableResultingContrastRatio, assignableResultingHex);
      // console.log(autoContrast.getLinearRatio(bufferedTargetContrast, assignableResultingContrastRatio));
    }
    while (
      direction === 'up' &&
      assignableResultingContrastRatio < bufferedTargetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 25
    ) {
      // console.log(
      //   'direction',
      //   direction,
      //   'Under',
      //   assignableResultingContrastRatio,
      //   autoContrast.getLinearRatio(bufferedTargetContrast, assignableResultingContrastRatio),
      // );
      run += 1;

      const newRatio = autoContrast.getLinearRatio(bufferedTargetContrast, assignableResultingContrastRatio);
      // console.log(newRatio);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      // console.log(assignableResultingSrgb);
      //   //console.log('assignableResultingSrgb', assignableResultingSrgb);
      // const hsl = colourSpace.convertSrgbToHslArray(assignableResultingSrgb);
      // const newRatio = autoContrast.getLinearRatio(bufferedTargetContrast, assignableResultingContrastRatio);
      // const newHsl = autoContrast.multiplyLuminance(hsl, newRatio);
      // //console.log(hsl);
      // //console.log(newHsl);
      // assignableResultingSrgb = colourSpace.convertHslArrayToSrgb(newHsl);

      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      // console.log('direction', direction, 'Under', assignableResultingContrastRatio, assignableResultingHex);
      // console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, bufferedTargetContrast));
    }

    while (
      direction === 'down' &&
      assignableResultingContrastRatio !== bufferedTargetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 25
    ) {
      // console.log(
      //   'direction',
      //   direction,
      //   'Over',
      //   assignableResultingContrastRatio,
      //   autoContrast.getLinearRatio(assignableResultingContrastRatio, bufferedTargetContrast),
      // );
      run += 1;

      const newRatio = autoContrast.getLinearRatio(assignableResultingContrastRatio, bufferedTargetContrast);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      // console.log(assignableResultingSrgb);
      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      // console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, bufferedTargetContrast));
    }
    // while (
    //   direction === 'down' &&
    //   assignableResultingContrastRatio < bufferedTargetContrast &&
    //   assignableResultingHex !== '#000000' &&
    //   assignableResultingHex !== '#ffffff' &&
    //   run < 25
    // ) {
    //   //console.log(
    //     'direction',
    //     direction,
    //     'Under',
    //     assignableResultingContrastRatio,
    //     autoContrast.getLinearRatio(assignableResultingContrastRatio, bufferedTargetContrast),
    //   );
    //   run += 1;

    //   const newRatio = autoContrast.getLinearRatio(assignableResultingContrastRatio, bufferedTargetContrast);
    //   //console.log(newRatio);
    //   assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
    //   //console.log(assignableResultingSrgb);

    //   ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
    //     autoContrast.getResults(assignableResultingSrgb, originalLuminance));
    //   //console.log('direction', direction, 'Under', assignableResultingContrastRatio, assignableResultingHex);
    //   //console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, bufferedTargetContrast));
    // }
    return { resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex };
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
  srgbToLinearLum(srgb: number[]) {
    const lum = luminance.convertSrgbToLuminance(srgb);
    const linearLum = autoContrast.luminanceToLinear(lum);
    return linearLum;
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
  adjustLuminance(targetLuminance: number, resultingSrgb: number[]) {
    let loopLimiter = 0;
    let currentSrgb = resultingSrgb;
    let currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
    while (loopLimiter < 10) {
      loopLimiter += 1;
      const ratio = autoContrast.luminancesToLinearRatio(currentLuminance, targetLuminance);
      currentSrgb = autoContrast.multiplySrgbRatio(currentSrgb, ratio);
      currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
    }

    return { targetLuminance, currentLuminance, matching: targetLuminance.toFixed(6) === currentLuminance.toFixed(6) };
  },
  contrast2dpFloor(input: number) {
    return 0.01 * Math.floor(input * 100);
  },
  adjustLuminanceB(
    targetContrast: number,
    originalLuminance: number,
    targetLuminance: number,
    resultingSrgb: number[],
  ) {
    const weighting = luminance.getLuminanceWeighting(resultingSrgb);
    // console.log('weighting', weighting);
    let loopLimiter = 0;
    const loopLimit = 10;
    const decimalPlaces = 7;
    let currentSrgb = resultingSrgb;
    let currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
    let equal = false;
    while (loopLimiter < loopLimit && equal === false) {
      loopLimiter += 1;
      const ratio = autoContrast.luminancesToLinearRatio(currentLuminance, targetLuminance, weighting);
      currentSrgb = autoContrast.multiplyLuminanceSrgb(currentSrgb, ratio);
      currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
      equal = targetLuminance.toFixed(decimalPlaces) === currentLuminance.toFixed(decimalPlaces);
    }
    let { resultingContrastRatio, resultingHex } = autoContrast.getResults(currentSrgb, originalLuminance);
    const isEqualContrast =
      autoContrast.contrast2dpFloor(resultingContrastRatio) === autoContrast.contrast2dpFloor(targetContrast);
    console.log('isEqualContrast:', isEqualContrast);
    console.log('loopLimiter:', loopLimiter);
    console.log({ resultingContrastRatio, resultingHex });
    if (isEqualContrast) return { resultingContrastRatio, resultingHex };
    // console.log('Running fine loop');
    ({ resultingContrastRatio, resultingHex } = autoContrast.adjustLuminanceFine(
      targetContrast,
      originalLuminance,
      targetLuminance,
      currentSrgb,
    ));
    // console.log({ resultingContrastRatio, resultingHex });
    return { resultingContrastRatio, resultingHex };
  },
  srgbIsWithinLimit(decimalArray: number[]) {
    const total = decimalArray.reduce((a: number, b: number) => a + b);
    return total > 0 && total < 3;
  },
  adjustLuminanceFine(
    targetContrast: number,
    originalLuminance: number,
    targetLuminance: number,
    resultingSrgb: number[],
  ) {
    let loopLimiter = 0;
    const loopLimit = 100;
    let currentSrgb = resultingSrgb;
    let currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
    let currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);
    let equal = false;
    let directionUp = currentContrast < targetContrast;
    const startIncrement = 2;
    let changesOfDirection = 0;
    let outOfBounds = 0;
    while (loopLimiter < loopLimit && equal === false && outOfBounds < 5) {
      const changesMultipier = 1 / Math.max(1, changesOfDirection);
      const increment = directionUp ? changesMultipier * startIncrement : changesMultipier * startIncrement * -1;
      loopLimiter += 1;
      currentSrgb = autoContrast.adjustLuminanceSrgb(currentSrgb, increment);
      currentLuminance = luminance.convertSrgbToLuminance(currentSrgb);
      currentContrast = contrast.getContrastRatio2Dp([originalLuminance, currentLuminance]);
      console.log('currentContrast:', currentContrast);
      equal = currentContrast === targetContrast;
      if (directionUp !== currentContrast < targetContrast) {
        directionUp = !directionUp;
        changesOfDirection += 1;
      }
      const inBounds = autoContrast.srgbIsWithinLimit(currentSrgb);
      if (inBounds) {
        outOfBounds = 0;
      }

      if (!inBounds) {
        outOfBounds += 1;
      }
    }
    const { resultingContrastRatio, resultingHex } = autoContrast.getResults(currentSrgb, originalLuminance);
    // console.log('isEqualContrast:', isEqualContrast);
    // console.log('loopLimiter:', loopLimiter);
    return { resultingContrastRatio, resultingHex };
  },
};

function getNewSrgb(
  targetContrast: number,
  assignableResultingContrastRatio: number,
  resultingSrgb: number[],
  direction: string,
) {
  const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
  const newTargetContrast = autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio);
  // console.log('newTargetContrast', newTargetContrast);
  // console.log('new target ratio: ', newTargetContrast);
  const newTargetLuminance = autoContrast.getTargetLuminance(direction, resultingLuminance, newTargetContrast);
  // console.log('new target luminance', newTargetLuminance);
  const newOriginalLinearLum = autoContrast.luminanceToLinear(resultingLuminance);
  const newTargetLinearLum = autoContrast.luminanceToLinear(newTargetLuminance);
  const newLinearRatio = autoContrast.getLinearRatio(newTargetLinearLum, newOriginalLinearLum);
  // console.log('newLinearRatio', newLinearRatio);
  const newAssignableResultingSrgb = autoContrast.multiplySrgbRatio(resultingSrgb, newLinearRatio);
  // console.log('newAssignableResultingSrgb', newAssignableResultingSrgb);
  return newAssignableResultingSrgb;
}

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
  if (isGreyscale) return autoContrast.setToTargetLuminanceGreyScale(targetLuminance, originalLuminance);

  const resultingSrgb = autoContrast.getResultingSrgb(originalLuminance, targetLuminance, originalSrgb);
  const { resultingContrastRatio, resultingHex } = autoContrast.getResults(resultingSrgb, originalLuminance);

  if (resultingHex === '#000000' || resultingHex === '#ffffff' || resultingContrastRatio === bufferedTargetContrast)
    return { resultingHex, resultingContrastRatio };
  return autoContrast.adjustLuminanceB(bufferedTargetContrast, originalLuminance, targetLuminance, resultingSrgb);
  // return autoContrast.adjustResults({
  // direction,
  // resultingContrastRatio,
  // bufferedTargetContrast,
  // resultingHex,
  // resultingSrgb,
  // originalLuminance,
  // originalSrgb,
  // });
}