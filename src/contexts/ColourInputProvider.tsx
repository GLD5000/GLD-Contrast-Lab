import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { setToTargetLuminance } from '../utilities/colour/autoContrast';
import { colourSpace } from '../utilities/colour/colourSpace';
import { contrast } from '../utilities/colour/contrastRatio';
import { luminance } from '../utilities/colour/luminance';
import getRandomColour, { randomColour } from '../utilities/colour/randomColour';
import { getSessionStorageMap, clearSessionStorageMap, setSessionStorageMap } from './sessionStorageMap';

const initialiserA: {
  textInput: string;
  mode: string;
  recentColour: { [key: string]: string | number } | undefined;
  previousColour: { [key: string]: string | number } | undefined;
  colourMap: undefined | Map<string, { [key: string]: string | number }>;
  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string;
      mode: string;
      recentColour: { [key: string]: string | number } | undefined;
      previousColour: { [key: string]: string | number } | undefined;
      colourMap: undefined | Map<string, { [key: string]: string | number }>;
    }>;
  }>;
} = {
  textInput: '',
  mode: 'Hex',
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
  dispatchColourInput: () => undefined,
};

const initialiserB: {
  textInput: string;
  mode: string;
  recentColour: { [key: string]: string | number } | undefined;
  previousColour: { [key: string]: string | number } | undefined;
  colourMap: undefined | Map<string, { [key: string]: string | number }>;
} = {
  textInput: '',
  mode: 'Hex',
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
};

function useData() {
  const [{ textInput, mode, recentColour, previousColour, colourMap }, dispatchColourInput] = useReducer(
    tagReducer,
    initialiserB,
  );
  useEffect(() => {
    dispatchColourInput({ type: 'INIT', payload: {} });
  }, []);
  return {
    textInput,
    mode,
    colourMap,
    recentColour,
    previousColour,
    dispatchColourInput,
  };
  function tagReducer(
    state: {
      textInput: string;
      mode: string;
      recentColour: { [key: string]: string | number } | undefined;
      previousColour: { [key: string]: string | number } | undefined;
      colourMap: undefined | Map<string, { [key: string]: string | number }>;
    },
    action: {
      type: string;
      payload: Partial<{
        textInput: string;
        mode: string;
        recentColour: { [key: string]: string | number } | undefined;
        previousColour: { [key: string]: string | number } | undefined;
        colourMap: undefined | Map<string, { [key: string]: string | number }>;
        tag: string;
      }>;
    },
  ): {
    textInput: string;
    mode: string;
    recentColour: { [key: string]: string | number } | undefined;
    previousColour: { [key: string]: string | number } | undefined;
    colourMap: undefined | Map<string, { [key: string]: string | number }>;
  } {
    switch (action.type) {
      case 'INIT': {
        const savedMap = getSessionStorageMap();
        const recentColourValue = makeColourObjectHsl(randomColour.makeRandomHslString());
        const returnValue = {
          textInput: recentColourValue.Hex,
          mode: 'Hex',
          recentColour: recentColourValue,
          previousColour: undefined,
          colourMap: savedMap,
        };
        return returnValue;
      }
      case 'RANDOMISE': {
        const newHex = getRandomColour();
        const currentMode = `${state.mode}` || 'Hex';
        const newColourObject = makeColourObject(newHex);
        const returnValue = { ...state, mode: currentMode, recentColour: newColourObject };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;
        if (newColourObject !== undefined) {
          returnValue.textInput = getRecentTextField(newColourObject, currentMode);
        }
        return returnValue;
      }
      case 'EDIT': {
        const newHex = action.payload.textInput || '#000000';
        const currentMode = `${state.mode}` || 'Hex';
        const newColourObject = makeColourObject(newHex);
        const returnValue = {
          ...state,
          mode: currentMode,
          recentColour: newColourObject,
          previousColour: setPreviousLuminance(newColourObject),
        };
        if (newColourObject !== undefined) {
          returnValue.textInput = getRecentTextField(newColourObject, currentMode);
        }
        return returnValue;
      }
      case 'CLEAR_TEXT': {
        const returnValue = { ...state, mode: 'Hex', recentColour: undefined, textInput: '' };
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        const { mode: modeState } = state;
        const isRelativeLuminance = modeState === 'RLum';

        if (isRelativeLuminance) return handleRlumUpdate(state, action.payload);

        const textReceived = action.payload.textInput;
        const isSubmit = /\s/.test(textReceived?.at(-1) || '');

        if (textReceived && isSubmit) {
          const recentColourReturn = makeRecentColour(state);
          if (recentColourReturn !== null) return recentColourReturn;
        }

        const { processedText, processedArray, recent } = processText(textReceived || '', modeState);
        const returnedColours = state.colourMap ? [...state.colourMap.keys()] : [];
        const joinedArrays = returnedColours ? [...returnedColours, ...processedArray] : processedArray;
        const newMap = createMap(joinedArrays) || undefined;
        const returnValue = {
          ...state,
          textInput: processedText || '',
          recentColour: recent,
          colourMap: newMap,
        };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;

        return returnValue;
      }
      case 'SUBMIT': {
        const recentColourReturn = makeRecentColour(state);
        if (recentColourReturn !== null) return recentColourReturn;

        const newText = state.textInput ? `${state.textInput}\t` : action.payload.textInput || '';
        const { processedText, processedArray, recent } = processText(
          newText || action.payload.textInput || '',
          state.mode,
        );
        const returnedColours = state.colourMap ? [...state.colourMap.keys()] : [];
        const joinedArrays = returnedColours ? [...returnedColours, ...processedArray] : processedArray;
        const newMap = createMap(joinedArrays) || undefined;
        const returnValue = {
          ...state,
          textInput: processedText || '',
          recentColour: recent,
          colourMap: newMap,
        };
        return returnValue;
      }

      case 'UPDATE_HSL': {
        const newHsl = action.payload.textInput;
        const recentColourValue: { [key: string]: string | number } | undefined = newHsl
          ? makeColourObjectHsl(newHsl)
          : undefined;
        const modeOut = state.mode ? state.mode : 'Hex';
        const textOutput = recentColourValue ? getRecentTextField(recentColourValue, modeOut) : '';
        const returnValue = {
          ...state,
          textInput: textOutput,
          recentColour: recentColourValue,
        };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;

        return returnValue;
      }
      case 'CLEAR_TAGS': {
        const newMap = new Map(state.colourMap);
        newMap.clear();
        clearSessionStorageMap();
        const returnValue = {
          ...state,
          colourMap: newMap,
          textInput: '',
          mode: 'Hex',
          recentColour: undefined,
        };
        return returnValue;
      }
      case 'CHANGE_MODE': {
        const newMode = `${action.payload.mode}` || 'Hex';
        const returnValue = { ...state, mode: newMode };
        const mostRecentColour = returnValue.recentColour;
        if (mostRecentColour !== undefined) {
          returnValue.textInput = getRecentTextField(mostRecentColour, newMode);
        }
        return returnValue;
      }
      case 'CLOSE_TAG':
      default: {
        const { tag } = action.payload;
        const newMap = new Map(state.colourMap);
        if (typeof tag === 'string' && newMap.has(tag)) newMap.delete(tag);
        setSessionStorageMap(newMap);
        const returnValue = { ...state, colourMap: newMap, recentColour: undefined };
        return returnValue;
      }
    }
  }
}

const ColourInput = createContext(initialiserA);
export const useColourInputContext = () => useContext(ColourInput);

export default function ColourInputProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourInput.Provider value={data}>{children}</ColourInput.Provider>;
}

function valueIsHex(input: string) {
  const returnBoolean = input.length === 7 && input.search(/#[0-9a-fA-F]{6}/) > -1;
  return returnBoolean;
}

function getRecentTextField(recentColourObject: { [key: string]: string | number }, modeString: string) {
  const lookupKey: { [key: string]: string } = {
    Hex: 'Hex',
    HSL: 'HSL',
    RGB: 'RGB',
    RLum: 'Luminance',
    CRB: 'Black',
    CRW: 'White',
  };

  const presetLookup: { [key: string]: string } = {
    RLum: 'RLum: ',
    Black: 'CRBl: ',
    White: 'CRWh: ',
  };
  const preset = presetLookup[modeString] || '';
  const returnString = `${preset}${recentColourObject[lookupKey[modeString]]}`;
  return returnString;
}

function makeRecentColour(stateIn: {
  textInput: string;
  mode: string;
  recentColour: { [key: string]: string | number } | undefined;
  previousColour: { [key: string]: string | number } | undefined;
  colourMap: undefined | Map<string, { [key: string]: string | number }>;
}) {
  const recentState = stateIn.recentColour;
  if (!recentState) return null;
  const newMap = addToMap(recentState, stateIn.colourMap || new Map());
  const returnValue = {
    ...stateIn,
    textInput: getRecentTextField(recentState, stateIn.mode),
    previousColour: setPreviousLuminance(stateIn.recentColour),
    colourMap: newMap,
  };
  return returnValue;
}

function processHexString(value: string) {
  const isHex = /^#[0-9a-fA-F]{1,6}$/.test(value);
  if (!isHex) return value;

  if (value.length === 7) return value;
  let modifiedHex = value.length > 7 ? value.slice(0, 7) : value;
  if (value.length < 7) {
    const characters = value.slice(1);
    modifiedHex = modifiedHex.padEnd(7, characters);
  }
  return modifiedHex;
}

function testColourString(
  testString: string,
  prefixLetters: string,
  withinRange: (testValue: number, index: number) => boolean,
) {
  const indexAfterOpenBracket = testString.indexOf('(') + 1;
  const indexOfClosedBracket = testString.indexOf(')');
  const indexOfLetters = testString.indexOf(prefixLetters);
  const prefix = testString.slice(indexOfLetters, indexAfterOpenBracket).toLowerCase().replaceAll(' ', '');
  const correctPrefix = prefix === `${prefixLetters}(`;
  const endsWithBracket = indexOfClosedBracket > -1;
  const containsTwoCommas = testString.replaceAll(',', '').length + 2 === testString.length;
  const shouldReturn = !correctPrefix || !endsWithBracket || !containsTwoCommas;
  if (shouldReturn) return { isCorrect: false, result: undefined };
  const stringArray = testString.slice(indexAfterOpenBracket, indexOfClosedBracket).replaceAll(/[ %]/g, '').split(',');
  const numberArray = stringArray.map((x) => parseInt(x, 10));
  const booleanResult = numberArray.every(withinRange);
  const arrayResult = booleanResult ? numberArray : undefined;
  return { isCorrect: booleanResult, result: arrayResult };
}
function testRgbString(stringIn: string) {
  const rgb = 'rgb';
  const rangeTest = (testValue: number) => testValue >= 0 && testValue <= 255;

  return testColourString(stringIn, rgb, rangeTest);
}
function testHslString(stringIn: string) {
  const hsl = 'hsl';
  const rangeTest = (testValue: number, index: number) =>
    index === 0 ? testValue >= 0 && testValue <= 360 : testValue >= 0 && testValue <= 100;

  return testColourString(stringIn, hsl, rangeTest);
}

function processRgbString(value: string) {
  const { isCorrect, result } = testRgbString(value);
  if (!isCorrect || result === undefined) return value;

  const hex = colourSpace.convertRgbToHex(result);
  return hex;
}

function processHslString(value: string) {
  const { isCorrect, result } = testHslString(value);
  if (!isCorrect || result === undefined) return value;

  const hex = colourSpace.convertHslArrayToHex(result);
  return hex;
}

function processColourStringLong(stringIn: string) {
  if (stringIn.length < 7) return stringIn;
  return processColourString(stringIn);
}
function getRecentColour(text: string): undefined | { [key: string]: string | number } {
  const testedProcessedText = valueIsHex(text) ? text : processColourStringLong(text);
  const recentColour = valueIsHex(testedProcessedText) ? makeColourObject(testedProcessedText) : undefined;
  return recentColour;
}

function processColourString(stringIn: string) {
  if (stringIn.includes('#')) return processHexString(stringIn);
  if (stringIn.toLowerCase().includes('hsl')) return processHslString(stringIn);
  if (stringIn.toLowerCase().includes('rgb')) return processRgbString(stringIn);
  return stringIn;
}

function hexReducer(acc: { processedText: string; processedArray: string[] }, curr: string) {
  const processedHex = processColourString(curr);
  if (processedHex.length === 7 && processedHex[0] === '#') {
    acc.processedArray.push(processedHex);
    return acc;
  }
  acc.processedText += acc.processedText.length > 0 ? ` ${curr}` : curr;
  return acc;
}

function processText(text: string, mode: string) {
  const isEmpty = text === '';
  if (isEmpty) {
    return emptyTextProcess();
  }

  const hasNoSpaces = text.search(/\s/) === -1;
  if (hasNoSpaces) {
    return singleTextProcess(text, mode);
  }

  const noSpaceAtEnd = text[text.length - 1].search(/\s/) === -1;

  if (noSpaceAtEnd) {
    return multiRecentProcess(text, mode);
  }
  return multiProcess(text);
}

function multiProcess(text: string) {
  const splitText = text.replaceAll(', ', ',').split(/\s/);

  const { processedText, processedArray } = splitText.reduce(hexReducer, {
    processedText: '',
    processedArray: [],
  });
  return { processedText, processedArray, recent: undefined };
}

function multiRecentProcess(text: string, mode: string) {
  const splitText = text.replaceAll(', ', ',').split(/\s/);
  const slicedArray = splitText.slice(0, -1);
  const lastElement = splitText.at(-1)?.replaceAll(',', ', ');
  const recentValue = lastElement && lastElement.length > 0 ? getRecentColour(lastElement) : undefined;

  const { processedText, processedArray } = slicedArray.reduce(hexReducer, {
    processedText: '',
    processedArray: [],
  });
  const suffixedText = processedText.length > 0 ? `${processedText} ${lastElement}` : `${lastElement}`;
  const textValue = recentValue ? getRecentTextField(recentValue, mode) : suffixedText;
  return { processedText: textValue, processedArray, recent: recentValue };
}

function singleTextProcess(text: string, mode: string) {
  const recentValue = getRecentColour(text);
  const textValue = recentValue ? getRecentTextField(recentValue, mode) : text;
  return { processedText: `${textValue}`, processedArray: [], recent: recentValue };
}

function emptyTextProcess() {
  return { processedText: '', processedArray: [], recent: undefined };
}

function makeColourObject(hexValue: string) {
  const luminanceFloat = luminance.convertHexToLuminance(hexValue);
  const Hex = hexValue;
  const HSL = colourSpace.convertHexToHslString(hexValue);
  const RGB = colourSpace.convertHextoRgbString(hexValue);
  const Luminance = luminance.convertHexToLuminancePercent(hexValue);
  const Black = `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`;
  const White = `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`;
  return {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
  };
}
function makeColourObjectHsl(hslValue: string) {
  const Hex = colourSpace.convertHslStringToHex(hslValue);
  const HSL = hslValue;
  const RGB = colourSpace.convertHextoRgbString(Hex);
  const Luminance = luminance.convertHexToLuminancePercent(Hex);
  const luminanceFloat = luminance.convertHexToLuminance(Hex);
  const Black = `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`;
  const White = `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`;
  return {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
  };
}

function createMap(hexArray: string[] | undefined) {
  if (!hexArray) return undefined;
  const filteredArray = hexArray.filter(valueIsHex);
  if (filteredArray.length === 0) return undefined;
  const buildArray: Iterable<readonly [string, { [key: string]: string | number }]> | null = filteredArray.map(
    (hex) => {
      const colourObject = makeColourObject(hex);
      return [hex, colourObject];
    },
  );
  const mapValue: Map<string, { [key: string]: string | number }> | undefined = buildArray
    ? new Map(buildArray)
    : undefined;
  if (mapValue) setSessionStorageMap(mapValue);
  return mapValue;
}

function addToMap(
  newObject: { [key: string]: string | number },
  existingMap: Map<string, { [key: string]: string | number }>,
) {
  const newMap = new Map([...existingMap]);

  newMap.set(`${newObject.Hex}`, newObject);

  if (newMap) setSessionStorageMap(newMap);

  return newMap;
}

function handleRlumUpdate(
  state: {
    textInput: string;
    mode: string;
    recentColour:
      | {
          [key: string]: string | number;
        }
      | undefined;
    previousColour:
      | {
          [key: string]: string | number;
        }
      | undefined;
    colourMap:
      | Map<
          string,
          {
            [key: string]: string | number;
          }
        >
      | undefined;
  },
  payload: Partial<{
    textInput: string;
    mode: string;
    recentColour:
      | {
          [key: string]: string | number;
        }
      | undefined;
    previousColour:
      | {
          [key: string]: string | number;
        }
      | undefined;
    colourMap:
      | Map<
          string,
          {
            [key: string]: string | number;
          }
        >
      | undefined;
    tag: string;
  }>,
) {
  const textReceived = payload.textInput;
  const isSubmit = /\s/.test(textReceived?.at(-1) || '');
  const textWithoutRLum = textReceived ? textReceived.replace('RLum:', '').replace(' ', '') : '';
  const recentColourState = state.recentColour;

  // if (!isSubmit && !textReceived) {
  //   console.log('!isSubmit && !textReceived');

  //   const returnValue = {
  //     ...state,
  //     textInput: 'RLum: ',
  //   };
  //   return returnValue;
  // }

  if (textReceived && isSubmit) {
    const isPercentage = textWithoutRLum.includes('%');
    const parsedFloat = Math.trunc(parseFloat(textWithoutRLum) * 10) * 0.001;
    const isInRange = parsedFloat >= 0 && parsedFloat <= 1;
    if (!isPercentage || !isInRange) {
      const returnValue = {
        ...state,
        textInput: textWithoutRLum ? `RLum: ${textWithoutRLum}` : 'RLum: ',
      };
      return returnValue;
    }

    const recentColourReturn = makeRecentColour(state);
    if (recentColourReturn !== null) return recentColourReturn;
  }

  if (!isSubmit && recentColourState && textReceived) {
    const currentHex = `${recentColourState.Hex}`;
    const isPercentage = textWithoutRLum.includes('%');
    const parsedFloat = Math.trunc(parseFloat(textWithoutRLum) * 10) * 0.001;
    const isInRange = parsedFloat >= 0 && parsedFloat <= 1;

    // if (!isPercentage) {
    //   console.log('!isPercentage');

    //   const returnValue = {
    //     ...state,
    //     textInput: `RLum: ${textWithoutRLum}` || 'RLum: ',
    //   };
    //   return returnValue;
    // }

    // if (!isInRange && isPercentage) {
    //   console.log('!isInRange && isPercentage');

    //   const returnValue = {
    //     ...state,
    //     textInput: `RLum: ${textWithoutRLum}` || 'RLum: ',
    //   };
    //   return returnValue;
    // }

    if (isInRange && isPercentage) {
      const { resultingHex: newHex } = setToTargetLuminance(currentHex, parsedFloat);
      const newColourObject = makeColourObject(newHex);
      const textValue = newColourObject ? getRecentTextField(newColourObject, 'RLum') : `RLum: ${textWithoutRLum}`;
      const returnValue = {
        ...state,
        textInput: textValue || 'RLum: ',
        recentColour: newColourObject,
      };
      return returnValue;
    }
  }
  const returnValue = {
    ...state,
    textInput: textWithoutRLum ? `RLum: ${textWithoutRLum}` : 'RLum: ',
  };
  return returnValue;
}
function setPreviousLuminance(
  colourObject:
    | {
        [key: string]: string | number;
      }
    | undefined,
) {
  const recentLuminance = colourObject?.luminanceFloat;
  console.log('recentLuminance:', recentLuminance);
  if (typeof recentLuminance === 'number') {
    return {
      luminance: recentLuminance,
      contrast: 1,
    };
  }

  return undefined;
}

function setPreviousContrast(state: {
  textInput: string;
  mode: string;
  recentColour:
    | {
        [key: string]: string | number;
      }
    | undefined;
  previousColour:
    | {
        [key: string]: string | number;
      }
    | undefined;
  colourMap:
    | Map<
        string,
        {
          [key: string]: string | number;
        }
      >
    | undefined;
}) {
  const recentLuminance = state.recentColour?.luminanceFloat;
  const previousLuminance = state.previousColour?.luminance;
  if (typeof recentLuminance === 'number' && typeof previousLuminance === 'number') {
    const ratio = contrast.getContrastRatio2Dp([recentLuminance, previousLuminance]);
    return { luminance: previousLuminance, contrast: ratio };
  }
  return undefined;
}
