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
  getLinearRatio(target: number, original: number) {
    return target / original;
  },
  setToTargetLuminanceGreyScale(targetLuminance: number, originalLuminance: number) {
    const resultingSrgb = luminance.convertLuminanceToSrgb(targetLuminance);
    const resultingHex = colourSpace.convertSrgbToHex(resultingSrgb);
    const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
    const resultingContrastRatio = contrast.getContrastRatio2Dp([originalLuminance, resultingLuminance]);
    console.log(resultingHex, resultingContrastRatio);
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
  adjustResults({
    direction,
    resultingContrastRatio,
    targetContrast,
    resultingHex,
    resultingSrgb,
    originalLuminance,
  }: // originalSrgb,
  {
    direction: string;
    resultingContrastRatio: number;
    targetContrast: number;
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
      assignableResultingContrastRatio > targetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 25
    ) {
      console.log(
        'direction',
        direction,
        'Over',
        assignableResultingContrastRatio,
        autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio),
      );
      run += 1;
      // const newHsl = autoContrast.decrementLuminance(hsl);
      // const hsl = colourSpace.convertSrgbToHslArray(assignableResultingSrgb);
      const newRatio = autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio);
      // const newHsl = autoContrast.multiplyLuminance(hsl, newRatio);
      // console.log(hsl);
      // console.log(newHsl);
      // assignableResultingSrgb = colourSpace.convertHslArrayToSrgb(newHsl);
      console.log(newRatio);

      const resultingLuminance = luminance.convertSrgbToLuminance(resultingSrgb);
      const newTargetContrast = newRatio;
      console.log('new target ratio: ', newTargetContrast);
      const newTargetLuminance = getTargetLuminance(direction, resultingLuminance, newTargetContrast);
      console.log('new target luminance', newTargetLuminance);
      const newOriginalLinearLum = autoContrast.luminanceToLinear(resultingLuminance);
      const newTargetLinearLum = autoContrast.luminanceToLinear(newTargetLuminance);
      const newLinearRatio = autoContrast.getLinearRatio(newTargetLinearLum, newOriginalLinearLum);
      console.log('newLinearRatio', newLinearRatio);
      const newAssignableResultingSrgb = autoContrast.multiplySrgbRatio(resultingSrgb, newLinearRatio);
      console.log('newAssignableResultingSrgb', newAssignableResultingSrgb);
      // assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      // console.log(assignableResultingSrgb);
      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(newAssignableResultingSrgb, originalLuminance));
      console.log('direction', direction, 'Over', assignableResultingContrastRatio, assignableResultingHex);
      console.log(autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio));
    }
    while (
      direction === 'up' &&
      assignableResultingContrastRatio < targetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 25
    ) {
      console.log(
        'direction',
        direction,
        'Under',
        assignableResultingContrastRatio,
        autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio),
      );
      run += 1;

      const newRatio = autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio);
      console.log(newRatio);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      console.log(assignableResultingSrgb);
      //   console.log('assignableResultingSrgb', assignableResultingSrgb);
      // const hsl = colourSpace.convertSrgbToHslArray(assignableResultingSrgb);
      // const newRatio = autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio);
      // const newHsl = autoContrast.multiplyLuminance(hsl, newRatio);
      // console.log(hsl);
      // console.log(newHsl);
      // assignableResultingSrgb = colourSpace.convertHslArrayToSrgb(newHsl);

      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      console.log('direction', direction, 'Under', assignableResultingContrastRatio, assignableResultingHex);
      console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast));
    }

    while (
      direction === 'down' &&
      assignableResultingContrastRatio !== targetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 25
    ) {
      console.log(
        'direction',
        direction,
        'Over',
        assignableResultingContrastRatio,
        autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast),
      );
      run += 1;

      const newRatio = autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      console.log(assignableResultingSrgb);
      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast));
    }
    // while (
    //   direction === 'down' &&
    //   assignableResultingContrastRatio < targetContrast &&
    //   assignableResultingHex !== '#000000' &&
    //   assignableResultingHex !== '#ffffff' &&
    //   run < 25
    // ) {
    //   console.log(
    //     'direction',
    //     direction,
    //     'Under',
    //     assignableResultingContrastRatio,
    //     autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast),
    //   );
    //   run += 1;

    //   const newRatio = autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast);
    //   console.log(newRatio);
    //   assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
    //   console.log(assignableResultingSrgb);

    //   ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
    //     autoContrast.getResults(assignableResultingSrgb, originalLuminance));
    //   console.log('direction', direction, 'Under', assignableResultingContrastRatio, assignableResultingHex);
    //   console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast));
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
};

export default function setToTargetContrast(
  originalHex: string,
  targetContrast: number,
  direction = 'up',
): { resultingHex: string; resultingContrastRatio: number } {
  const originalSrgb = colourSpace.convertHexToSrgbArray(originalHex);
  const originalLuminance = luminance.convertSrgbToLuminance(originalSrgb);
  const targetLuminance = getTargetLuminance(direction, originalLuminance, targetContrast);

  if (targetLuminance === 1 || targetLuminance === 0 || Math.min(...originalSrgb) === Math.max(...originalSrgb))
    return autoContrast.setToTargetLuminanceGreyScale(targetLuminance, originalLuminance);

  const originalLinearLum = autoContrast.luminanceToLinear(originalLuminance);
  const targetLinearLum = autoContrast.luminanceToLinear(targetLuminance);
  const linearRatio = autoContrast.getLinearRatio(targetLinearLum, originalLinearLum);
  const resultingSrgb = autoContrast.multiplySrgbRatio(originalSrgb, linearRatio);
  const { resultingContrastRatio, resultingHex } = autoContrast.getResults(resultingSrgb, originalLuminance);

  if (resultingHex === '#000000' || resultingHex === '#ffffff' || resultingContrastRatio === targetContrast)
    return { resultingHex, resultingContrastRatio };

  return autoContrast.adjustResults({
    direction,
    resultingContrastRatio,
    targetContrast,
    resultingHex,
    resultingSrgb,
    originalLuminance,
    // originalSrgb,
  });
}
function getTargetLuminance(direction: string, originalLuminance: number, targetContrast: number) {
  return direction === 'up'
    ? autoContrast.getIncreasedLuminance(originalLuminance, targetContrast)
    : autoContrast.getDecreasedLuminance(originalLuminance, targetContrast);
}
