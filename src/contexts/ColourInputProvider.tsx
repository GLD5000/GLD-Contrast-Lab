import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { setToTargetLuminance } from '../utilities/colour/autoContrast';
import { colourSpace } from '../utilities/colour/colourSpace';
import { contrast } from '../utilities/colour/contrastRatio';
import { luminance } from '../utilities/colour/luminance';
import getRandomColour from '../utilities/colour/randomColour';
import { getSessionStorageMap, clearSessionStorageMap, setSessionStorageMap } from './sessionStorageMap';

const initialiserA: {
  textInput: string;
  mode: string;
  type: string;
  recentColour: { [key: string]: string | number } | undefined;
  previousColour: { [key: string]: string | number } | undefined;
  colourMap: undefined | Map<string, { [key: string]: string | number }>;
  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      number: number;
      textInput: string;
      mode: string;
      type: string;
      recentColour: { [key: string]: string | number } | undefined;
      previousColour: { [key: string]: string | number } | undefined;
      colourMap: undefined | Map<string, { [key: string]: string | number }>;
    }>;
  }>;
} = {
  textInput: '',
  mode: 'Hex',
  type: 'Lum',
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
  dispatchColourInput: () => undefined,
};

const initialiserB: {
  textInput: string;
  mode: string;
  type: string;
  recentColour: { [key: string]: string | number } | undefined;
  previousColour: { [key: string]: string | number } | undefined;
  colourMap: undefined | Map<string, { [key: string]: string | number }>;
} = {
  textInput: '',
  mode: 'Hex',
  type: 'Lum',
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
};

function useData() {
  const [{ textInput, mode, type, recentColour, previousColour, colourMap }, dispatchColourInput] = useReducer(
    tagReducer,
    initialiserB,
  );
  useEffect(() => {
    dispatchColourInput({ type: 'INIT', payload: {} });
  }, []);
  return {
    textInput,
    mode,
    type,
    colourMap,
    recentColour,
    previousColour,
    dispatchColourInput,
  };
  function tagReducer(
    state: {
      textInput: string;
      mode: string;
      type: string;
      recentColour: { [key: string]: string | number } | undefined;
      previousColour: { [key: string]: string | number } | undefined;
      colourMap: undefined | Map<string, { [key: string]: string | number }>;
    },
    action: {
      type: string;
      payload: Partial<{
        number: number;
        textInput: string;
        mode: string;
        type: string;
        recentColour: { [key: string]: string | number } | undefined;
        previousColour: { [key: string]: string | number } | undefined;
        colourMap: undefined | Map<string, { [key: string]: string | number }>;
        tag: string;
      }>;
    },
  ): {
    textInput: string;
    mode: string;
    type: string;
    recentColour: { [key: string]: string | number } | undefined;
    previousColour: { [key: string]: string | number } | undefined;
    colourMap: undefined | Map<string, { [key: string]: string | number }>;
  } {
    switch (action.type) {
      case 'INIT': {
        // console.log('INIT');

        const savedMap = getSessionStorageMap();
        // const recentColourValue = makeColourObjectHsl(randomColour.makeRandomHslString(), state);
        const returnValue = {
          // textInput: `${recentColourValue.Hex}`,
          textInput: '',
          mode: 'Hex',
          type: 'Lum',
          // recentColour: recentColourValue,
          recentColour: undefined,
          previousColour: undefined,
          colourMap: savedMap,
        };

        return returnValue;
      }
      case 'RANDOMISE': {
        // console.log('RANDOMISE');

        const newHex = getRandomColour();
        const currentMode = `${state.mode}` || 'Hex';
        const newColourObject = makeColourObject(newHex, state);
        const returnValue = { ...state, mode: currentMode, recentColour: newColourObject };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;
        if (newColourObject !== undefined) {
          returnValue.textInput = getRecentTextField(newColourObject, currentMode);
        }
        return returnValue;
      }
      case 'EDIT': {
        // console.log('EDIT');

        const newHex = action.payload.textInput;
        if (!newHex) return { ...state };
        const currentMode = `${state.mode}` || 'Hex';
        const newColourObject = makeColourObject(newHex, state);
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
        // console.log('CLEAR_TEXT');
        const returnValue = {
          ...state,
          mode: 'Hex',
          type: 'Lum',
          recentColour: undefined,
          textInput: '',
          previousColour: undefined,
        };
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        // console.log('UPDATE_TEXT');
        const { mode: modeState } = state;
        const hasRecentColour = state.recentColour !== undefined;
        // console.log('hasRecentColour:', hasRecentColour);
        const isRelativeLuminanceMode = modeState === 'RLum';
        const isNameMode = modeState === 'Name';
        const textReceived = action.payload.textInput;
        const isSubmit = /\s/.test(textReceived?.replaceAll(/(, )|(: )/g, '')?.at(-1) || '');
        if (isRelativeLuminanceMode) return handleRlumUpdate(state, action.payload);

        if (isNameMode) {
          const textWithoutName = textReceived
            ? textReceived.replace('Name:', '').replaceAll(/[\s]/g, '').slice(0, 18)
            : '';
          const returnObject = { ...state, textInput: textWithoutName ? `Name: ${textWithoutName}` : 'Name: ' };

          if (returnObject.recentColour) returnObject.recentColour.Name = textWithoutName || '';

          return returnObject;
        }

        if (textReceived && isSubmit) {
          const recentColourReturn = submitRecentColour(state);
          if (recentColourReturn !== null) return recentColourReturn;
        }

        const { processedText, processedArray, recent } = processText(textReceived || '', state);
        const returnedColours = state.colourMap ? state.colourMap : new Map();
        const { joinedMap: newMap, stringOut } =
          createMap(processedArray, state, processedText, returnedColours) || undefined;
        // console.log('stringOut:', stringOut);
        if (hasRecentColour) {
          const preset = getModePreset(state.mode);
          const presetText = `${preset}​${stringOut.replace(`​`, '').replace(preset, '')}`;
          const returnValue = {
            ...state,
            textInput: isSubmit ? `${presetText} ` : presetText || '',
            recentColour: recent,
            colourMap: newMap,
          };
          const previousValue = setPreviousContrast(returnValue);
          if (previousValue) returnValue.previousColour = previousValue;

          return returnValue;
        }
        const returnValue = {
          ...state,
          textInput: isSubmit ? `${stringOut} ` : stringOut || '',
          recentColour: recent,
          colourMap: newMap,
        };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;

        return returnValue;
      }
      case 'SUBMIT': {
        // console.log('SUBMIT');
        const recentColourReturn = submitRecentColour(state);
        if (recentColourReturn !== null) return recentColourReturn;

        const newText = state.textInput ? `${state.textInput}\t` : action.payload.textInput || '';
        const { processedText, processedArray, recent } = processText(newText || action.payload.textInput || '', state);
        const returnedColours = state.colourMap ? state.colourMap : new Map();
        const { joinedMap: newMap, stringOut } =
          createMap(processedArray, state, processedText, returnedColours) || undefined;
        const returnValue = {
          ...state,
          textInput: stringOut || '',
          recentColour: recent,
          colourMap: newMap,
          mode: 'Name',
        };
        return returnValue;
      }

      case 'UPDATE_HSL': {
        // console.log('UPDATE_HSL');
        const sliderType = action.payload.type;
        const sliderValue = action.payload.number;
        // console.log(sliderType,sliderValue);

        const In = state.recentColour;
        // console.log('hasRecentColour:', state.In!== undefined);

        if (In === undefined || sliderValue === undefined || sliderType === undefined) return { ...state };
        const oldHsl = `${In.HSL}`;
        // console.log('oldHsl:', oldHsl);
        const newHsl = getHslValueFromSlider(sliderValue, sliderType, oldHsl);
        // console.log('newHsl:', newHsl);
        const recentColourValue: { [key: string]: string | number } | undefined = newHsl
          ? makeColourObjectHsl(newHsl, state)
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
      case 'SET_TYPE': {
        // console.log('SET_TYPE');

        const typeIn = action.payload.textInput || 'Lum';
        const returnValue = {
          ...state,
          type: typeIn,
        };
        return returnValue;
      }
      case 'MATCH_LUMINANCE': {
        // console.log('MATCH_LUMINANCE');
        const previousLuminance = state.previousColour?.luminance;
        const newHex = action.payload.textInput;

        if (typeof previousLuminance === 'number' && typeof newHex === 'string') {
          const { resultingHex } = setToTargetLuminance(newHex, previousLuminance);
          const newObject = makeColourObject(resultingHex, state);
          const modeOut = state.mode ? state.mode : 'Hex';
          const textOutput = newObject ? getRecentTextField(newObject, modeOut) : '';
          const returnValue = {
            ...state,
            textInput: textOutput,
            recentColour: newObject,
          };
          const previousContrast = setPreviousContrast(returnValue);
          if (previousContrast !== undefined) returnValue.previousColour = previousContrast;
          return returnValue;
        }
        return { ...state };
      }
      case 'CLEAR_TAGS': {
        // console.log('CLEAR_TAGS');
        const newMap = new Map(state.colourMap);
        newMap.clear();
        clearSessionStorageMap();
        const returnValue = {
          ...state,
          colourMap: newMap,
          textInput: '',
          mode: 'Hex',
          type: 'Lum',
          recentColour: undefined,
        };
        return returnValue;
      }
      case 'CHANGE_MODE': {
        // console.log('CHANGE_MODE')
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
        // console.log('CLOSE_TAG');

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
  const modeKey = getModeKey(modeString);
  const preset = getModePreset(modeString);
  const modeIsColour = modeString === 'HSL' || modeString === 'RGB' || modeString === 'Hex';
  const returnString = recentColourObject[modeKey] ? `${recentColourObject[modeKey]}` : '';
  const returnValue = modeIsColour
    ? `${preset}​${returnString.replace(`​`, '').replace(preset, '')}`
    : `${preset}${returnString.replace(preset, '')}`;
  return returnValue;
}

function getModeKey(modeString: string) {
  const lookupKey: { [key: string]: string } = {
    Hex: 'Hex',
    HSL: 'HSL',
    RGB: 'RGB',
    RLum: 'Luminance',
    CRB: 'Black',
    CRW: 'White',
    Name: 'Name',
  };
  const modeKey = lookupKey[modeString];
  return modeKey;
}

function getModePreset(modeString: string) {
  const presetLookup: { [key: string]: string } = {
    Hex: '#',
    HSL: 'HSL',
    RGB: 'RGB',
    RLum: 'Relative Luminance: ',
    Black: 'Contrast Black: ',
    White: 'Contrast White: ',
    Name: 'Name: ',
  };
  const preset = presetLookup[modeString] || '';
  return preset;
}

function submitRecentColour(stateIn: {
  textInput: string;
  mode: string;
  type: string;
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
  const indexOfLetters = testString.toLowerCase().indexOf(prefixLetters);
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
  // console.log(isCorrect, result);
  if (!isCorrect || result === undefined) return value;
  const hex = colourSpace.convertHslArrayToHex(result);
  return hex;
}

function processColourStringLong(stringIn: string) {
  if (stringIn.length < 7) return stringIn;
  return processColourString(stringIn);
}
function getRecentColour(
  text: string,
  state: {
    textInput: string;
    mode: string;
    type: string;
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
): undefined | { [key: string]: string | number } {
  const testedProcessedText = valueIsHex(text) ? text : processColourStringLong(text);
  const recentColour = valueIsHex(testedProcessedText)
    ? makeColourObject(testedProcessedText, state)
    : state.recentColour; // broken does not handle hsl / rgb properly
  return recentColour;
}

function processColourString(stringIn: string) {
  if (stringIn.includes('#')) return processHexString(stringIn);
  if (stringIn.toLowerCase().includes('hsl')) return processHslString(stringIn);
  if (stringIn.toLowerCase().includes('rgb')) return processRgbString(stringIn);
  return stringIn;
}

function hexReducer(acc: { processedTextArray: string[]; processedArray: string[] }, curr: string) {
  const processedHex = processColourString(curr);
  if (processedHex.length === 7 && processedHex[0] === '#') {
    acc.processedArray.push(processedHex);
    return acc;
  }
  if (curr.length > 0) acc.processedTextArray.push(curr);
  return acc;
}

function processText(
  text: string,
  state: {
    textInput: string;
    mode: string;
    type: string;
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
) {
  const isEmpty = text === '';
  if (isEmpty) {
    return emptyTextProcess(state);
  }
  const noQuotesText = text
    .replaceAll(/['":]/g, '')
    .replaceAll('),', ')')
    .replaceAll(/(,[\r\n]+)/g, '\r\n');
  const noCommaSpaceText = text.replaceAll(', ', ',').replaceAll(`​`, '');
  const hasNoSpaces = noCommaSpaceText.search(/\s/) === -1;
  const noSpaceAtEnd = text[text.length - 1].search(/\s/) === -1 && text.search(/[\r\n]/) === -1;
  // const hasRecent = state.recentColour !== undefined;
  // console.log('hasRecent:', hasRecent);

  if (hasNoSpaces) {
    return singleTextProcess(noCommaSpaceText, state);
  }

  if (noSpaceAtEnd) {
    return multiRecentProcess(text, state);
  }
  return multiProcess(`${noQuotesText}\r\n`);
}

function multiProcess(text: string) {
  console.log('multiProcess');
  const splitText = text.replaceAll(', ', ',').split(/\s/);

  const { processedTextArray, processedArray } = splitText.reduce(hexReducer, {
    processedTextArray: [],
    processedArray: [],
  });

  if (processedTextArray.length === processedArray.length) {
    // console.log('name');
  }

  const processedText = processedTextArray.join(' ');
  return { processedText, processedArray, recent: undefined };
}

function multiRecentProcess(
  text: string,
  state: {
    textInput: string;
    mode: string;
    type: string;
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
) {
  console.log('multiRecentProcess');

  const { mode } = state;
  const splitText = text.replaceAll(', ', ',').split(/\s/);
  const slicedArray = splitText.slice(0, -1);
  const lastElement = splitText.at(-1)?.replaceAll(',', ', ');
  const recentValue = lastElement && lastElement.length > 0 ? getRecentColour(lastElement, state) : undefined;

  const { processedTextArray, processedArray } = slicedArray.reduce(hexReducer, {
    processedTextArray: [],
    processedArray: [],
  });
  if (recentValue !== undefined) {
    const name = processedTextArray.length >= 1 ? processedTextArray.at(-1) : recentValue.Hex;
    recentValue.Name = name || '';
  }
  // console.log(processedTextArray, processedArray, lastElement);
  const processedText = processedTextArray.join(' ');
  const suffixedText = processedText.length > 0 ? `${processedText} ${lastElement}` : `${lastElement}`;
  const textValue = recentValue ? getRecentTextField(recentValue, mode) : suffixedText;
  return { processedText: textValue, processedArray, recent: recentValue };
}

function singleTextProcess(
  text: string,
  state: {
    textInput: string;
    mode: string;
    type: string;
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
) {
  // console.log('singleTextProcess');
  // if (state.recentColour){
  const recentValue = getRecentColour(text, state);
  if (recentValue !== undefined) {
    const name = recentValue.Hex || '';
    recentValue.Name = name;
  }

  const textValue = text;
  return { processedText: `${textValue}`, processedArray: [], recent: recentValue };
  // }

  // return { processedText: text || '', processedArray: [], recent: undefined };
}

function emptyTextProcess(state: {
  textInput: string;
  mode: string;
  type: string;
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
  // console.log('empty', state.recentColour);

  return { processedText: '', processedArray: [], recent: state.recentColour };
}

function makeColourObject(
  hexValue: string,
  state: {
    textInput: string;
    mode: string;
    type: string;
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
  name?: string | undefined,
) {
  const slicedNewName = name?.slice(0, 18) || undefined;
  const foundMap = state.colourMap && hexValue.length === 7 ? state.colourMap.get(hexValue) : undefined;
  if (foundMap !== undefined) {
    if (slicedNewName) foundMap.Name = slicedNewName;
    return foundMap;
  }

  const luminanceFloat = luminance.convertHexToLuminance(hexValue);
  const Hex = hexValue;
  const HSL = colourSpace.convertHexToHslString(hexValue);
  const RGB = colourSpace.convertHextoRgbString(hexValue);
  const Luminance = luminance.convertHexToLuminancePercent(hexValue);
  const Black = `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`;
  const White = `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`;
  const stateName = state.recentColour?.Name;
  const nonStaleHexName = stateName !== undefined && !valueIsHex(`${stateName}`) ? `${stateName}` : Hex;

  const Name = slicedNewName || nonStaleHexName;
  const returnObject = {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
    Name,
  };
  return returnObject;
}
function makeColourObjectHsl(
  hslValue: string,
  state: {
    textInput: string;
    mode: string;
    type: string;
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
) {
  const Hex = colourSpace.convertHslStringToHex(hslValue);
  const HSL = hslValue;
  const RGB = colourSpace.convertHextoRgbString(Hex);
  const Luminance = luminance.convertHexToLuminancePercent(Hex);
  const luminanceFloat = luminance.convertHexToLuminance(Hex);
  const Black = `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`;
  const White = `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`;
  const stateName = state.recentColour?.Name;
  const Name = stateName !== undefined && !valueIsHex(`${stateName}`) ? `${stateName}` : Hex;
  return {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
    Name,
  };
}

function createMap(
  hexArray: string[] | undefined,
  state: {
    textInput: string;
    mode: string;
    type: string;
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
  processedText: string,
  oldMap: Map<string, { [key: string]: string | number }>,
) {
  const names = processedText.split(' ');
  // console.log(names);
  if (!hexArray || !state) return { joinedMap: oldMap, stringOut: processedText };
  const filteredArray = hexArray.filter(valueIsHex);
  const arrayLength = names.length;
  if (!filteredArray || filteredArray.length === 0) return { joinedMap: oldMap, stringOut: processedText };
  const getAtIndex = (index: number) => arrayLength - (filteredArray.length - index);
  const buildArray: Iterable<readonly [string, { [key: string]: string | number }]> | null = filteredArray.map(
    (hex, index) => {
      const atIndex = getAtIndex(index);
      // console.log('atIndex:', atIndex);
      // console.log('names[atIndex]:', names[atIndex]);
      const colourObject = makeColourObject(hex, state, names[atIndex]);
      names[atIndex] = '';
      return [hex, colourObject];
    },
  );
  if (buildArray === undefined) return { joinedMap: oldMap, stringOut: processedText };
  const mapValue: Map<string, { [key: string]: string | number }> = buildArray ? new Map(buildArray) : new Map();
  const joinedMap = oldMap ? new Map([...oldMap, ...mapValue]) : mapValue;
  if (joinedMap) setSessionStorageMap(joinedMap);
  const stringOut = names.join('');
  return { joinedMap, stringOut };
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
    type: string;
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
    number: number;
    textInput: string;
    mode: string;
    type: string;
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
  const isSubmit = /\s/.test(textReceived?.replaceAll(/(, )|(: )/g, '')?.at(-1) || '');
  const textWithoutRLum = textReceived ? textReceived.replace('Relative Luminance:', '').replace(' ', '') : '';
  const recentColourState = state.recentColour;

  // if (!isSubmit && !textReceived) {
  //   // console.log('!isSubmit && !textReceived');

  //   const returnValue = {
  //     ...state,
  //     textInput: 'Relative Luminance: ',
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
        textInput: textWithoutRLum ? `Relative Luminance: ${textWithoutRLum}` : 'Relative Luminance: ',
      };
      return returnValue;
    }

    const recentColourReturn = submitRecentColour(state);
    if (recentColourReturn !== null) return recentColourReturn;
  }

  if (!isSubmit && recentColourState && textReceived) {
    const currentHex = `${recentColourState.Hex}`;
    const isPercentage = textWithoutRLum.includes('%');
    const parsedFloat = Math.trunc(parseFloat(textWithoutRLum) * 10) * 0.001;
    const isInRange = parsedFloat >= 0 && parsedFloat <= 1;

    // if (!isPercentage) {
    //   // console.log('!isPercentage');

    //   const returnValue = {
    //     ...state,
    //     textInput: `Relative Luminance: ${textWithoutRLum}` || 'Relative Luminance: ',
    //   };
    //   return returnValue;
    // }

    // if (!isInRange && isPercentage) {
    //   // console.log('!isInRange && isPercentage');

    //   const returnValue = {
    //     ...state,
    //     textInput: `Relative Luminance: ${textWithoutRLum}` || 'Relative Luminance: ',
    //   };
    //   return returnValue;
    // }

    if (isInRange && isPercentage) {
      const { resultingHex: newHex } = setToTargetLuminance(currentHex, parsedFloat);
      const newColourObject = makeColourObject(newHex, state);
      const textValue = newColourObject
        ? getRecentTextField(newColourObject, 'RLum')
        : `Relative Luminance: ${textWithoutRLum}`;
      const returnValue = {
        ...state,
        textInput: textValue || 'Relative Luminance: ',
        recentColour: newColourObject,
      };
      return returnValue;
    }
  }
  const returnValue = {
    ...state,
    textInput: textWithoutRLum ? `Relative Luminance: ${textWithoutRLum}` : 'Relative Luminance: ',
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
  type: string;
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

function convertSliderToHsl(value: number, type: string) {
  if (type !== 'Hue') return Math.round(value / 3.6);
  return Math.round(value);
}

function stringifyHslArray(ArrayIn: number[]) {
  const [hue, sat, lum] = ArrayIn;
  const stringValue = `HSL(${hue}, ${sat}%, ${lum}%)`;
  return stringValue;
}

function getHslValueFromSlider(value: number, type: string, hslString: string) {
  const convertedSliderValue = convertSliderToHsl(value, type);
  const [Hue, Sat, Lum] = parseHslStringToArray(hslString);
  const hslLookUp: { [key: string]: number[] } = {
    Hue: [convertedSliderValue, Sat, Lum],
    Sat: [Hue, convertedSliderValue, Lum],
    Lum: [Hue, Sat, convertedSliderValue],
  };
  // console.log(hslLookUp[type]);
  return stringifyHslArray(hslLookUp[type]);
}
function parseHslStringToArray(stringIn: string) {
  const arrayValue = stringIn
    .toLowerCase()
    .replaceAll(/[hsl( )%]/g, '')
    .split(',')
    .map((x) => parseInt(x, 10));
  return arrayValue;
}
