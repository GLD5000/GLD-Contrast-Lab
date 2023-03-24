import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { setToTargetLuminance, setToTargetLuminanceHsl } from '../utilities/colour/autoContrast';
import { colourSpace } from '../utilities/colour/colourSpace';
import { contrast } from '../utilities/colour/contrastRatio';
import { luminance } from '../utilities/colour/luminance';
import getRandomColour from '../utilities/colour/randomColour';
import { getSessionStorageMap, clearSessionStorageMap, setSessionStorageMap } from './sessionStorageMap';

export interface StrNumObj {
  [key: string]: string | number;
}
export interface ColourObj {
  [key: string]: number | string | Map<string, number>;
  luminanceFloat: number;
  Hex: string;
  HSL: string;
  RGB: string;
  Luminance: string;
  Black: number;
  White: number;
  Name: string;
  contrastRatios: Map<string, number>;
}
export type ColourMap = Map<string, ColourObj>;

export interface ColourState {
  hslLuminanceTarget: number;
  hslSlider: number;
  textInput: string;
  colourMode: string;
  sliderType: string;
  recentColour: ColourObj | undefined;
  previousColour: StrNumObj | undefined;
  colourMap: ColourMap | undefined;
}
export type ColourPayload = Partial<{
  hslLuminanceTarget: number;
  hslSlider: number;
  number: number;
  textInput: string;
  colourMode: string;
  sliderType: string;
  recentColour: ColourObj | undefined;
  previousColour: StrNumObj | undefined;
  colourMap: ColourMap | undefined;
  tag: string;
}>;
export interface ColourContext extends ColourState {
  dispatchColourInput: Dispatch<{
    type: string;
    payload: ColourPayload;
  }>;
}

const initialiserA: ColourContext = {
  hslLuminanceTarget: 17.7,
  hslSlider: 0,
  textInput: '',
  colourMode: 'Hex',
  sliderType: 'Lum',
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
  dispatchColourInput: () => undefined,
};

const initialiserB: ColourState = {
  hslLuminanceTarget: 17.7,
  hslSlider: 0,

  textInput: '',
  colourMode: 'Hex',
  sliderType: 'Lum',
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
};

function useData() {
  const [
    { hslLuminanceTarget, hslSlider, textInput, colourMode, sliderType, recentColour, previousColour, colourMap },
    dispatchColourInput,
  ] = useReducer(tagReducer, initialiserB);
  useEffect(() => {
    dispatchColourInput({ type: 'INIT', payload: {} });
  }, []);
  return {
    hslLuminanceTarget,
    hslSlider,
    textInput,
    colourMode,
    sliderType,
    colourMap,
    recentColour,
    previousColour,
    dispatchColourInput,
  };
  function tagReducer(
    state: ColourState,
    action: {
      type: string;
      payload: ColourPayload;
    },
  ): ColourState {
    switch (action.type) {
      case 'INIT': {
        // console.log('INIT');

        const savedMap = getSessionStorageMap();
        // const recentColourValue = makeColourObjectHsl(randomColour.makeRandomHslString(), state);
        const returnValue = {
          // textInput: `${recentColourValue.Hex}`,
          hslLuminanceTarget: 17.7,
          hslSlider: 0,
          textInput: '',
          colourMode: 'Hex',
          sliderType: 'Lum',
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
        const currentMode = 'Hex';
        const newColourObject = makeColourObject(newHex, state.colourMap, undefined);
        const returnValue = { ...state, colourMode: currentMode, recentColour: newColourObject };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;
        if (newColourObject !== undefined) {
          returnValue.textInput = getRecentTextField(newColourObject, currentMode);
          returnValue.hslSlider = getSliderValueHslString(newColourObject.HSL, state.sliderType);
        }
        return returnValue;
      }
      case 'EDIT': {
        // console.log('EDIT');

        const newHex = action.payload.textInput;
        if (!newHex) return { ...state };
        const currentMode = 'Hex';
        const newColourObject = makeColourObject(newHex, state.colourMap, state.recentColour?.Name);
        const previousObject = setPreviousLuminance(newColourObject);
        const returnValue = {
          ...state,
          colourMode: currentMode,
          recentColour: newColourObject,
          previousColour: previousObject,
          hslSlider: getSliderValueHslString(newColourObject.HSL, state.sliderType),
        };
        if (newColourObject !== undefined) {
          returnValue.textInput = getRecentTextField(newColourObject, currentMode);
        }

        const stateLuminance = previousObject?.luminance;
        // console.log('stateLuminance:', stateLuminance);
        if (typeof stateLuminance === 'number') returnValue.hslLuminanceTarget = stateLuminance;

        return returnValue;
      }
      case 'CLEAR_TEXT': {
        // console.log('CLEAR_TEXT');
        const returnValue = {
          ...state,
          colourMode: 'Hex',
          sliderType: 'Lum',
          recentColour: undefined,
          textInput: '',
          previousColour: undefined,
        };
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        // console.log('UPDATE_TEXT');
        const { colourMode: modeState } = state;
        const hasRecentColour = state.recentColour !== undefined;
        // console.log('hasRecentColour:', hasRecentColour);
        const isRelativeLuminanceMode = modeState === 'RLum';
        const isNameMode = modeState === 'Name';
        const textReceived = action.payload.textInput;
        const isSubmit = /\s/.test(textReceived?.replaceAll(/(, )|(: )/g, '')?.at(-1) || '');
        if (isRelativeLuminanceMode) return handleRlumUpdate(state, action.payload);

        if (textReceived && isSubmit) {
          const recentColourReturn = submitRecentColour(state);
          if (recentColourReturn !== null) return recentColourReturn;
        }
        if (isNameMode) {
          const textWithoutName = textReceived
            ? textReceived.replace('Name:', '').replaceAll(/[\s]/g, '').slice(0, 18)
            : '';
          const returnObject = { ...state, textInput: textWithoutName ? `Name: ${textWithoutName}` : 'Name: ' };

          if (returnObject.recentColour) returnObject.recentColour.Name = textWithoutName || '';

          return returnObject;
        }

        const { processedText, processedArray, recent } = processText(textReceived || '', state);
        const returnedColours = state.colourMap ? state.colourMap : undefined;
        const { joinedMap: newMap, stringOut } =
          createMap(processedArray, state, processedText, returnedColours) || undefined;
        // console.log('stringOut:', stringOut);
        if (hasRecentColour) {
          const preset = getModePreset(state.colourMode);
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
        const returnedColours = state.colourMap ? state.colourMap : undefined;
        const { joinedMap: newMap, stringOut } =
          createMap(processedArray, state, processedText, returnedColours) || undefined;
        const returnValue = {
          ...state,
          textInput: stringOut || '',
          recentColour: recent,
          colourMap: newMap,
          colourMode: 'Name',
        };
        return returnValue;
      }

      case 'UPDATE_HSL': {
        const { sliderType: newSliderType } = action.payload;
        const sliderValue = action.payload.hslSlider;
        const previousLuminance = state.hslLuminanceTarget;

        console.log('sliderValue:', sliderValue);
        const In = state.recentColour;

        if (In === undefined || sliderValue === undefined || newSliderType === undefined) return { ...state };
        const oldHsl = `${In.HSL}`;
        const newHsl = getHslValueFromSlider(sliderValue, newSliderType, oldHsl);
        const newHslArray = parseHslStringToArray(newHsl);
        const newHex = colourSpace.convertHslStringToHex(newHsl);
        // const previousLuminance = state.recentColour?.luminanceFloat || state.previousColour?.luminance;
        if (typeof previousLuminance === 'number' && typeof newHex === 'string' && newSliderType !== 'Lum') {
          const { resultingHsl } = setToTargetLuminanceHsl(newHslArray, previousLuminance);
          const resultingHslString = stringifyHslArray(resultingHsl);
          const newObject = makeColourObjectHsl(resultingHslString, state);
          const modeOut = 'HSL';
          const textOutput = newObject ? getRecentTextField(newObject, modeOut) : '';

          const returnValue = {
            ...state,
            textInput: textOutput,
            recentColour: newObject,
            colourMode: modeOut,
            hslSlider: sliderValue,
          };
          const previousContrast = setPreviousContrast(returnValue);
          if (previousContrast !== undefined) returnValue.previousColour = previousContrast;
          return returnValue;
        }

        const recentColourValue: ColourObj | undefined = newHsl ? makeColourObjectHsl(newHsl, state) : undefined;
        const modeOut = 'HSL';
        const textOutput = recentColourValue ? getRecentTextField(recentColourValue, modeOut) : '';
        const returnValue = {
          ...state,
          textInput: textOutput,
          recentColour: recentColourValue,
          colourMode: modeOut,
          hslSlider: sliderValue,
          hslLuminanceTarget: recentColourValue?.luminanceFloat || previousLuminance,
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
          sliderType: typeIn,
        };
        if (state.recentColour?.HSL) returnValue.hslSlider = getSliderValueHslString(state.recentColour.HSL, typeIn);

        const stateLuminance = state.recentColour?.luminanceFloat;
        console.log('stateLuminance:', stateLuminance);
        if (typeIn === 'Hue' && typeof stateLuminance === 'number') returnValue.hslLuminanceTarget = stateLuminance;
        return returnValue;
      }
      case 'MATCH_LUMINANCE': {
        // console.log('MATCH_LUMINANCE');
        const previousLuminance = state.previousColour?.luminance;
        const newHex = action.payload.textInput;

        if (typeof previousLuminance === 'number' && typeof newHex === 'string') {
          const { resultingHex } = setToTargetLuminance(newHex, previousLuminance);
          const newObject = makeColourObject(resultingHex, state.colourMap, state.recentColour?.Name);
          const modeOut = state.colourMode ? state.colourMode : 'Hex';
          const textOutput = newObject ? getRecentTextField(newObject, modeOut) : '';
          const returnValue = {
            ...state,
            textInput: textOutput,
            recentColour: newObject,
            hslLuminanceTarget: previousLuminance,
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
          colourMode: 'Hex',
          sliderType: 'Lum',
          recentColour: undefined,
        };
        return returnValue;
      }
      case 'CHANGE_COLOUR_MODE': {
        // console.log('CHANGE_COLOUR_MODE')
        const newMode = `${action.payload.colourMode}` || 'Hex';
        const returnValue = { ...state, colourMode: newMode };
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
        const returnValue = { ...state, colourMap: newMap };
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
function getRecentTextField(recentColourObject: ColourObj, modeString: string): string {
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

function submitRecentColour(stateIn: ColourState) {
  const recentState = stateIn.recentColour;
  if (!recentState) return null;
  const newMap = addColourObjectToStorage(recentState, stateIn.colourMap);
  const returnValue = {
    ...stateIn,
    textInput: getRecentTextField(recentState, 'Name'),
    previousColour: setPreviousLuminance(stateIn.recentColour),
    colourMap: newMap,
    colourMode: 'Name',
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
function getRecentColour(text: string, state: ColourState) {
  const testedProcessedText = valueIsHex(text) ? text : processColourStringLong(text);
  const recentColour = valueIsHex(testedProcessedText)
    ? makeColourObject(testedProcessedText, state.colourMap, state.recentColour?.Name)
    : state.recentColour;
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

function processText(text: string, state: ColourState) {
  const isEmpty = text === '';
  if (isEmpty) {
    return emptyTextProcess(state);
  }
  const noQuotesText = text
    .replaceAll(/['":]/g, '')
    .replaceAll('),', ')')
    .replaceAll(/(,[\s]+)/g, '\n')
    .replaceAll(/(,\s*$)/g, '');

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
  return multiProcess(`${noQuotesText}`);
}

function multiProcess(text: string) {
  console.log('multiProcess');
  const splitText = text.replaceAll(', ', ',').split(/\s/);
  console.log('splitText:', splitText);
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

function multiRecentProcess(text: string, state: ColourState) {
  // console.log('multiRecentProcess');

  const { colourMode } = state;
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
  const textValue = recentValue ? getRecentTextField(recentValue, colourMode) : suffixedText;
  return { processedText: textValue, processedArray, recent: recentValue };
}

function singleTextProcess(text: string, state: ColourState) {
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
  colourMode: string;
  sliderType: string;
  recentColour: ColourObj | undefined;
  previousColour: StrNumObj | undefined;
  colourMap: ColourMap | undefined;
}) {
  // console.log('empty', state.recentColour);

  return { processedText: '', processedArray: [], recent: state.recentColour };
}

function makeColourObject(hexValue: string, mapIn: ColourMap | undefined, name: string | undefined) {
  const slicedNewName = name?.slice(0, 18) || undefined;
  const existingMap = mapIn || new Map();
  // console.log('existingMap.size:', existingMap?.size);
  const foundMap = existingMap && hexValue.length === 7 ? existingMap.get(hexValue) : undefined;
  if (foundMap !== undefined) {
    if (slicedNewName) foundMap.Name = slicedNewName;
    return foundMap;
  }

  const luminanceFloat = luminance.convertHexToLuminance(hexValue);
  const Hex = hexValue;
  const HSL = colourSpace.convertHexToHslString(hexValue);
  const RGB = colourSpace.convertHextoRgbString(hexValue);
  const Luminance = luminance.convertHexToLuminancePercent(hexValue);
  const Black = contrast.getContrastRatio2Dp([0, luminanceFloat]);
  const White = contrast.getContrastRatio2Dp([1, luminanceFloat]);
  const otherColourRatios: undefined | Array<[string, number]> = existingMap
    ? [...existingMap.keys()].map((key) => {
        const otherLuminance = luminance.convertHexToLuminance(key);
        return [key, contrast.getContrastRatio2Dp([luminanceFloat, otherLuminance])];
      })
    : undefined;
  const arrays: Iterable<readonly [string, number]> = otherColourRatios
    ? [['Black', Black], ['White', White], ...otherColourRatios]
    : [
        ['Black', Black],
        ['White', White],
      ];
  const contrastRatios = new Map(arrays);
  // console.log(slicedNewName, valueIsHex(`${slicedNewName}`), Hex);
  // const stateName = state.recentColour?.Name;
  // const nonStaleHexName = stateName !== undefined && !valueIsHex(`${stateName}`) ? `${stateName}` : Hex;
  const nonStaleHexName = slicedNewName !== undefined && !valueIsHex(`${slicedNewName}`) ? `${slicedNewName}` : Hex;

  const Name = nonStaleHexName;
  const returnObject = {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
    Name,
    contrastRatios,
  };
  return returnObject;
}
function makeColourObjectHsl(hslValue: string, state: ColourState) {
  const Hex = colourSpace.convertHslStringToHex(hslValue);
  const HSL = hslValue;
  const RGB = colourSpace.convertHextoRgbString(Hex);
  const Luminance = luminance.convertHexToLuminancePercent(Hex);
  const luminanceFloat = luminance.convertHexToLuminance(Hex);
  const Black = contrast.getContrastRatio2Dp([0, luminanceFloat]);
  const White = contrast.getContrastRatio2Dp([1, luminanceFloat]);
  const contrastRatios = new Map([
    ['Black', Black],
    ['White', White],
  ]);

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
    contrastRatios,
  };
}

function createMap(
  hexArray: string[] | undefined,
  state: ColourState,
  processedText: string,
  oldMap: ColourMap | undefined,
) {
  const names = processedText.split(' ');
  // console.log(names);
  if (!hexArray || !state) return { joinedMap: oldMap, stringOut: processedText };
  const filteredArray = hexArray.filter(valueIsHex);
  const arrayLength = names.length;
  if (!filteredArray || filteredArray.length === 0) return { joinedMap: oldMap, stringOut: processedText };
  let workingMap = oldMap || new Map();
  const getAtIndex = (index: number) => arrayLength - (filteredArray.length - index);
  filteredArray.forEach((hex, index) => {
    const atIndex = getAtIndex(index);
    const colourObject = makeColourObject(hex, workingMap, names[atIndex]);
    workingMap = addColourObjectToMap(colourObject, workingMap);
    names[atIndex] = '';
  });
  if (workingMap === undefined) return { joinedMap: oldMap, stringOut: processedText };
  if (workingMap) setSessionStorageMap(workingMap);

  const stringOut = names.join('');
  return { joinedMap: workingMap, stringOut };
}

function addColourObjectToMap(newObject: ColourObj, existingMap: ColourMap | undefined) {
  const newMap = existingMap ? new Map([...existingMap]) : new Map();
  const newContrastMap = newObject.contrastRatios;
  const newHex = newObject.Hex;
  newMap.forEach((object) => {
    const currentHex = object.Hex;
    const contrastRatio = newContrastMap.get(currentHex);
    if (contrastRatio) object.contrastRatios.set(newHex, contrastRatio);
  });
  newMap.set(`${newObject.Hex}`, newObject);

  return newMap;
}

function addColourObjectToStorage(newObject: ColourObj, existingMap: ColourMap | undefined) {
  const newMap = existingMap ? new Map([...existingMap]) : new Map();
  // console.log('newMap:', newMap);
  const newContrastMap = newObject.contrastRatios;
  const newHex = newObject.Hex;
  newMap.forEach((object) => {
    const currentHex = object.Hex;
    const contrastRatio = newContrastMap.get(currentHex);
    if (contrastRatio) object.contrastRatios.set(newHex, contrastRatio);
  });
  newMap.set(`${newObject.Hex}`, newObject);

  if (newMap) setSessionStorageMap(newMap);
  return newMap;
}

function handleRlumUpdate(state: ColourState, payload: ColourPayload) {
  const textReceived = payload.textInput;
  const isSubmit = /\s/.test(textReceived?.replaceAll(/(, )|(: )/g, '')?.at(-1) || '');
  const textWithoutRLum = textReceived ? textReceived.replace('Relative Luminance:', '').replace(' ', '') : '';
  const recentColourState = state.recentColour;

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

    if (isInRange && isPercentage) {
      const { resultingHex: newHex } = setToTargetLuminance(currentHex, parsedFloat);
      const newColourObject = makeColourObject(newHex, state.colourMap, state.recentColour?.Name);
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
function setPreviousLuminance(colourObject: ColourObj | undefined) {
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
  colourMode: string;
  sliderType: string;
  recentColour: ColourObj | undefined;
  previousColour: StrNumObj | undefined;
  colourMap: ColourMap | undefined;
}) {
  const recentLuminance = state.recentColour?.luminanceFloat;
  const previousLuminance = state.previousColour?.luminance;
  if (typeof recentLuminance === 'number' && typeof previousLuminance === 'number') {
    const ratio = contrast.getContrastRatio2Dp([recentLuminance, previousLuminance]);
    return { luminance: previousLuminance, contrast: ratio };
  }
  return undefined;
}

function convertSliderToHsl(value: number, sliderType: string) {
  if (sliderType !== 'Hue') return Math.round(value / 3.6);
  return Math.round(value);
}

function stringifyHslArray(ArrayIn: number[]) {
  const [hue, sat, lum] = ArrayIn;
  const stringValue = `HSL(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%)`;
  return stringValue;
}

function getHslValueFromSlider(value: number, sliderType: string, hslString: string) {
  const convertedSliderValue = convertSliderToHsl(value, sliderType);
  const [Hue, Sat, Lum] = parseHslStringToArray(hslString);
  const hslLookUp: { [key: string]: number[] } = {
    Hue: [convertedSliderValue, Sat, Lum],
    Sat: [Hue, convertedSliderValue, Lum],
    Lum: [Hue, Sat, convertedSliderValue],
  };
  // console.log(hslLookUp[sliderType]);
  return stringifyHslArray(hslLookUp[sliderType]);
}
function parseHslStringToArray(stringIn: string) {
  const arrayValue = stringIn
    .toLowerCase()
    .replaceAll(/[hsl( )%]/g, '')
    .split(',')
    .map((x) => parseInt(x, 10));
  return arrayValue;
}
function convertHslToSlider(value: number, sliderType: string) {
  if (sliderType !== 'Hue') return Math.round(value * 3.6);
  return Math.round(value);
}

function getSliderValueHslString(hslString: string, sliderType: string) {
  const [Hue, Sat, Lum] = parseHslStringToArray(hslString);
  const valueLookup: { [key: string]: number } = {
    Hue,
    Sat,
    Lum,
  };
  const newValue = convertHslToSlider(valueLookup[sliderType], sliderType);
  return newValue;
}
