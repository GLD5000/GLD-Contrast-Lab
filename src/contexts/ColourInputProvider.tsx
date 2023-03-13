import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { colourSpace } from '../utilities/colour/colourSpace';
import { contrast } from '../utilities/colour/contrastRatio';
import { luminance } from '../utilities/colour/luminance';

const initialiserA: {
  textInput: string;
  recentColour:
    | {
        luminanceFloat: number;
        Hex: string;
        HSL: string;
        RGB: string;
        Luminance: string;
        Black: string;
        White: string;
      }
    | undefined;
  colourSet: Set<string>;
  colourMap: Map<string, { [key: string]: string }>;

  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string;
      recentColour:
        | {
            luminanceFloat: number;
            Hex: string;
            HSL: string;
            RGB: string;
            Luminance: string;
            Black: string;
            White: string;
          }
        | undefined;
      colourSet: Set<string>;
      colourMap: Map<string, { [key: string]: string }>;
    }>;
  }>;
} = {
  textInput: '',
  recentColour: undefined,
  colourSet: new Set(''),
  colourMap: new Map(),
  dispatchColourInput: () => undefined,
};

const initialiserB: {
  textInput: string;
  recentColour:
    | {
        luminanceFloat: number;
        Hex: string;
        HSL: string;
        RGB: string;
        Luminance: string;
        Black: string;
        White: string;
      }
    | undefined;
  colourSet: Set<string>;
  colourMap: Map<string, { [key: string]: string }>;
} = {
  textInput: '',
  recentColour: undefined,
  colourSet: new Set(''),
  colourMap: new Map(),
};

function useData() {
  //    '#fafafa\r#f4f4f5\r#e4e4e7\r#d4d4d8\r#a1a1aa\r#71717a\r#52525b\r#3f3f46\r#27272a\r#18181b',

  const [{ textInput, recentColour, colourSet, colourMap }, dispatchColourInput] = useReducer(tagReducer, initialiserB);

  useEffect(() => {
    dispatchColourInput({ type: 'INIT', payload: {} });
  }, []);

  return {
    textInput,
    colourSet,
    colourMap,
    recentColour,
    dispatchColourInput,
  };
  function tagReducer(
    state: {
      textInput: string;
      recentColour:
        | {
            luminanceFloat: number;
            Hex: string;
            HSL: string;
            RGB: string;
            Luminance: string;
            Black: string;
            White: string;
          }
        | undefined;
      colourSet: Set<string>;
      colourMap: Map<string, { [key: string]: string }>;
    },
    action: {
      type: string;
      payload: Partial<{
        textInput: string;
        recentColour:
          | {
              luminanceFloat: number;
              Hex: string;
              HSL: string;
              RGB: string;
              Luminance: string;
              Black: string;
              White: string;
            }
          | undefined;
        colourSet: Set<string>;
        colourMap: Map<string, { [key: string]: string }>;

        tag: string;
      }>;
    },
  ): {
    textInput: string;
    recentColour:
      | {
          luminanceFloat: number;
          Hex: string;
          HSL: string;
          RGB: string;
          Luminance: string;
          Black: string;
          White: string;
        }
      | undefined;
    colourSet: Set<string>;
    colourMap: Map<string, { [key: string]: string }>;
  } {
    switch (action.type) {
      case 'INIT': {
        const savedString = sessionStorage.getItem('colourSet') ?? '';
        const { processedText, processedArray } = processText(
          savedString.replaceAll(',', '\r') || '#b6b6c8\r#565678\r#557766\r#ffddff\r',
        );
        const recentColourValue = getRecentColour(processedText || processedArray.at(-1) || '');
        const newMap = createMap(processedArray) || new Map();
        const returnValue = {
          textInput: processedText,
          recentColour: recentColourValue,
          colourSet: new Set(processedArray),
          colourMap: newMap,
        };
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        const { processedText, processedArray } = processText(action.payload.textInput || '');
        const joinedArrays = [...state.colourSet, ...processedArray];
        const newSet = new Set(joinedArrays);
        sessionStorage.setItem('colourSet', `${[...newSet].join(',')},`);
        const newMap = createMap(joinedArrays) || new Map();
        const recentColourValue = getRecentColour(processedText);
        const returnValue = {
          textInput: processedText || '',
          recentColour: recentColourValue,
          colourSet: newSet,
          colourMap: newMap,
        };
        return returnValue;
      }
      case 'CLEAR_TAGS': {
        const newSet = new Set(state.colourSet);
        newSet.clear();
        sessionStorage.setItem('colourSet', `${[...newSet].join(',')},`);

        const returnValue = { ...state, colourSet: newSet, textInput: '', recentColour: undefined };
        return returnValue;
      }
      case 'CLOSE_TAG':
      default: {
        const newSet = new Set(state.colourSet);

        if (typeof action.payload.tag === 'string' && newSet.has(action.payload.tag)) newSet.delete(action.payload.tag);
        sessionStorage.setItem('colourSet', `${[...newSet].join(',')},`);
        const returnValue = { ...state, colourSet: newSet, recentColour: undefined };
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
  const returnBoolean = input.length === 7 && input.search(/#[0-9a-fA-F]{6}/) === 0;
  return returnBoolean;
}

function processHexString(value: string) {
  if (value[0] !== '#' || value.length < 2 || value.slice(1).search(/#|[^0-9a-fA-F]/) > -1) return value;
  let modifiedHex = value.length > 7 ? value.slice(0, 7) : value;
  if (value.length < 7) {
    const characters = value.slice(1);
    modifiedHex = modifiedHex.padEnd(7, characters);
  }
  return modifiedHex;
}

function processRgbString(value: string) {
  console.log('value:', value);
  const rgbRegex =
    /(rgb(\(((25[0-5])|(2[0-4][0-9])|(1?[0-9]{1,2})),[ ]?((25[0-5])|(2[0-4][0-9])|(1?[0-9]{1,2})),[ ]?((25[0-5])|(2[0-4][0-9])|(1?[0-9]{1,2}))\)))/;

  // if (value.search(/rgb\([\d]{1,3},[\d]{1,3},[\d]{1,3}\)/) === -1) return value;
  if (value.search(rgbRegex) === -1) return value;
  const cleanedUpValue = value.toLowerCase().replaceAll(/[ ()rgb]/g, '');
  const rgbArray = cleanedUpValue.split(',').map((x) => parseInt(x, 10));
  const hex = colourSpace.convertRgbToHex(rgbArray);
  return hex;
}

function processHslString(value: string) {
  const hslRegex = /hsl\(((360)|(3[0-5][0-9])|([1-2]?[0-9]{1,2}))(,[ ]?(100|([0-9]{1,2}))%?){2}\)/;
  // if (value.search(/hsl\([\d]{1,3},[\d]{1,3},[\d]{1,3}\)/) === -1) return value;
  if (value.search(hslRegex) === -1) return value;
  const cleanedUpValue = value.toLowerCase().replaceAll(/[ ()hsl%]/g, '');
  const hslArray = cleanedUpValue.split(',').map((x) => parseInt(x, 10));
  const hex = colourSpace.convertHslArrayToHex(hslArray);
  return hex;
}

function processColourStringLong(stringIn: string) {
  if (stringIn.length < 7) return stringIn;
  return processColourString(stringIn);
}
function getRecentColour(text: string):
  | undefined
  | {
      luminanceFloat: number;
      Hex: string;
      HSL: string;
      RGB: string;
      Luminance: string;
      Black: string;
      White: string;
    } {
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

function processText(text: string) {
  if (text === '' || text.search(/\s/) === -1) {
    return { processedText: text, processedArray: [] };
  }
  const shouldSkipLastElement = text[text.length - 1].search(/\s/) === -1;
  const splitText = text.replaceAll(', ', ',').split(/\s/);
  if (shouldSkipLastElement) {
    const slicedArray = splitText.slice(0, -1);
    const lastElement = splitText.at(-1);
    const { processedText, processedArray } = slicedArray.reduce(hexReducer, {
      processedText: '',
      processedArray: [],
    });
    const suffixedText = processedText.length > 0 ? `${processedText} ${lastElement}` : `${lastElement}`;
    return { processedText: suffixedText, processedArray };
  }
  const { processedText, processedArray } = splitText.reduce(hexReducer, {
    processedText: '',
    processedArray: [],
  });
  return { processedText, processedArray };
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

function createMap(hexArray: string[]) {
  const buildArray: Iterable<readonly [string, { [key: string]: string | number }]> | null = hexArray.map((hex) => {
    const colourObject = makeColourObject(hex);
    return [hex, colourObject];
  });

  const map: Map<string, { [key: string]: string | number }> | null = buildArray ? new Map(buildArray) : null;
  return map;
}
