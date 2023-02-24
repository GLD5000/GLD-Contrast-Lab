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
  adjustResults(
    direction: string,
    resultingContrastRatio: number,
    targetContrast: number,
    resultingHex: string,
    resultingSrgb: number[],
    originalSrgb: number[],
    linearRatio: number,
    originalLuminance: number,
  ): { resultingContrastRatio: number; resultingHex: string } {
    let run = 0;
    let assignableResultingContrastRatio = resultingContrastRatio;
    let assignableResultingHex = resultingHex;
    let assignableResultingSrgb = resultingSrgb;
    while (
      direction === 'up' &&
      assignableResultingContrastRatio > targetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 12
    ) {
      console.log(
        'direction',
        direction,
        'loopA',
        assignableResultingContrastRatio,
        autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast),
      );
      run += 1;
      const newRatio = autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio);
      console.log(newRatio);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      console.log(assignableResultingSrgb);
      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      console.log('direction', direction, 'loopA', assignableResultingContrastRatio, assignableResultingHex);
      console.log(autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio));
    }
    while (
      direction === 'up' &&
      assignableResultingContrastRatio < targetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 12
    ) {
      console.log(
        'direction',
        direction,
        'loopB',
        assignableResultingContrastRatio,
        autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast),
      );
      run += 1;

      const newRatio = autoContrast.getLinearRatio(targetContrast, assignableResultingContrastRatio);
      console.log(newRatio);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      console.log(assignableResultingSrgb);

      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      console.log('direction', direction, 'loopB', assignableResultingContrastRatio, assignableResultingHex);
      console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast));
    }

    while (
      direction === 'down' &&
      assignableResultingContrastRatio > targetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 12
    ) {
      console.log(
        'direction',
        direction,
        'loopC',
        assignableResultingContrastRatio,
        autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast),
      );
      run += 1;

      const newRatio = autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast);
      console.log(newRatio);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      console.log(assignableResultingSrgb);

      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      console.log('direction', direction, 'loopC', assignableResultingContrastRatio, assignableResultingHex);
      console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast));
    }
    while (
      direction === 'down' &&
      assignableResultingContrastRatio < targetContrast &&
      assignableResultingHex !== '#000000' &&
      assignableResultingHex !== '#ffffff' &&
      run < 12
    ) {
      console.log(
        'direction',
        direction,
        'loopD',
        assignableResultingContrastRatio,
        autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast),
      );
      run += 1;

      const newRatio = autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast);
      console.log(newRatio);
      assignableResultingSrgb = autoContrast.multiplySrgbRatio(assignableResultingSrgb, newRatio);
      console.log(assignableResultingSrgb);

      ({ resultingContrastRatio: assignableResultingContrastRatio, resultingHex: assignableResultingHex } =
        autoContrast.getResults(assignableResultingSrgb, originalLuminance));
      console.log('direction', direction, 'loopD', assignableResultingContrastRatio, assignableResultingHex);
      console.log(autoContrast.getLinearRatio(assignableResultingContrastRatio, targetContrast));
    }
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
  const targetLuminance =
    direction === 'up'
      ? autoContrast.getIncreasedLuminance(originalLuminance, targetContrast)
      : autoContrast.getDecreasedLuminance(originalLuminance, targetContrast);

  if (targetLuminance === 1 || targetLuminance === 0 || Math.min(...originalSrgb) === Math.max(...originalSrgb))
    return autoContrast.setToTargetLuminanceGreyScale(targetLuminance, originalLuminance);

  const originalLinearLum = autoContrast.luminanceToLinear(originalLuminance);
  const targetLinearLum = autoContrast.luminanceToLinear(targetLuminance);
  const linearRatio = autoContrast.getLinearRatio(targetLinearLum, originalLinearLum);
  const resultingSrgb = autoContrast.multiplySrgbRatio(originalSrgb, linearRatio);
  const { resultingContrastRatio, resultingHex } = autoContrast.getResults(resultingSrgb, originalLuminance);

  if (resultingHex === '#000000' || resultingHex === '#ffffff' || resultingContrastRatio === targetContrast)
    return { resultingHex, resultingContrastRatio };

  return autoContrast.adjustResults(
    direction,
    resultingContrastRatio,
    targetContrast,
    resultingHex,
    resultingSrgb,
    originalSrgb,
    linearRatio,
    originalLuminance,
  );
}
