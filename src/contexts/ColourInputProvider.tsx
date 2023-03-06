import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { colourSpace } from '../utilities/colour/colourSpace';

const initialiserA: {
  textInput: string | undefined;
  colourSet: Set<string>;

  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string | undefined;
      colourSet: Set<string>;
    }>;
  }>;
} = {
  textInput: '',
  colourSet: new Set(''),
  dispatchColourInput: () => undefined,
};

const initialiserB: {
  textInput: string | undefined;
  colourSet: Set<string>;
} = {
  textInput: '',
  colourSet: new Set(''),
};

function useData() {
  //    '#fafafa\r#f4f4f5\r#e4e4e7\r#d4d4d8\r#a1a1aa\r#71717a\r#52525b\r#3f3f46\r#27272a\r#18181b',

  const [{ textInput, colourSet }, dispatchColourInput] = useReducer(tagReducer, initialiserB);

  useEffect(() => {
    dispatchColourInput({ type: 'INIT', payload: {} });
  }, []);

  return {
    textInput,
    colourSet,

    dispatchColourInput,
  };
  function tagReducer(
    state: { textInput: string | undefined; colourSet: Set<string> },
    action: {
      type: string;
      payload: Partial<{
        textInput: string | undefined | undefined;
        colourSet: Set<string>;

        tag: string;
      }>;
    },
  ): { textInput: string | undefined; colourSet: Set<string> } {
    switch (action.type) {
      case 'INIT': {
        const { processedText, processedArray } = processText(
          '#eff6ff\r#dbeafe\r#bfdbfe\r#93c5fd\r#60a5fa\r#3b82f6\r#2563eb\r#1d4ed8\r#1e40af\r#1e3a8a\r',
        );
        const returnValue = {
          textInput: processedText,
          colourSet: new Set(processedArray),
        };
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        const { processedText, processedArray } = processText(action.payload.textInput);
        const returnValue = {
          textInput: processedText,
          colourSet: new Set([...state.colourSet, ...processedArray]),
        };
        return returnValue;
      }
      case 'CLEAR_TAGS': {
        const newSet = new Set(state.colourSet);
        newSet.clear();
        const returnValue = { ...state, colourSet: newSet, textInput: '' };
        return returnValue;
      }
      case 'CLOSE_TAG': {
        const newSet = new Set(state.colourSet);
        if (typeof action.payload.tag === 'string' && newSet.has(action.payload.tag)) newSet.delete(action.payload.tag);
        const returnValue = { ...state, colourSet: newSet };
        return returnValue;
      }

      case 'TOGGLE_TAG':
      default: {
        const newSet = new Set(state.colourSet);
        if (typeof action.payload.tag === 'string' && newSet.has(action.payload.tag)) newSet.delete(action.payload.tag);
        if (typeof action.payload.tag === 'string' && !newSet.has(action.payload.tag)) newSet.add(action.payload.tag);
        const returnValue = { ...state, colourSet: newSet };
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
  const cleanedUpValue = value.toLowerCase().replaceAll(/[()rgb]/g, '');
  if (cleanedUpValue.search(/^[\d]{1,3},[\d]{1,3},[\d]{1,3}$/) === -1) return value;
  const rgbArray = cleanedUpValue.split(',').map((x) => parseInt(x, 10));
  const hex = colourSpace.convertRgbToHex(rgbArray);
  return hex;
}

function processHslString(value: string) {
  const cleanedUpValue = value.toLowerCase().replaceAll(/[()hsl%]/g, '');
  if (cleanedUpValue.search(/^[\d]{1,3},[\d]{1,3},[\d]{1,3}$/) === -1) return value;
  const hslArray = cleanedUpValue.split(',').map((x) => parseInt(x, 10));
  const hex = colourSpace.convertHslArrayToHex(hslArray);
  return hex;
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

function processText(text: string | undefined) {
  if (text === undefined || text.search(/[ \r\n]+/) === -1) {
    console.log(text);
    return { processedText: text, processedArray: [] };
  }
  const shouldSkipLastElement = text[text.length - 1].search(/[ \r\n]/) === -1;
  const splitText = text.split(/[ \r\n]+/);
  if (shouldSkipLastElement) {
    const slicedArray = splitText.slice(0, -1);
    const { processedText, processedArray } = slicedArray.reduce(hexReducer, {
      processedText: '',
      processedArray: [],
    });
    const suffixedText =
      processedText.length > 0 ? `${processedText} ${splitText.at(-1)}` : `${processedText}${splitText.at(-1)}`;
    return { processedText: suffixedText, processedArray };
  }
  return splitText.reduce(hexReducer, {
    processedText: '',
    processedArray: [],
  });
}
