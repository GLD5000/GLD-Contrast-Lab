import { createContext, ReactNode, useContext, useReducer, Dispatch } from 'react';

const initialiserA: {
  textInput: string;
  colourSet: Set<string>;
  limit: number;
  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string;
      colourSet: Set<string>;
      limit: number;
    }>;
  }>;
} = {
  textInput: '',
  colourSet: new Set(''),
  limit: 14,
  dispatchColourInput: () => undefined,
};

const initialiserB: {
  textInput: string;
  colourSet: Set<string>;
  limit: number;
} = {
  textInput: '',
  colourSet: new Set(''),
  limit: 14,
};

function useData() {
  //    '#fafafa\r#f4f4f5\r#e4e4e7\r#d4d4d8\r#a1a1aa\r#71717a\r#52525b\r#3f3f46\r#27272a\r#18181b',

  const [{ textInput, colourSet, limit }, dispatchColourInput] = useReducer(tagReducer, initialiserB);
  // dispatchColourInput({ type: 'INIT', payload: '' });
  return {
    textInput,
    colourSet,
    limit,
    dispatchColourInput,
  };
  function tagReducer(
    state: { textInput: string; colourSet: Set<string>; limit: number },
    action: { type: string; payload: Partial<{ textInput: string; colourSet: Set<string>; limit: number }> },
  ): { textInput: string; colourSet: Set<string>; limit: number } {
    switch (action.type) {
      case 'INIT': {
        const returnValue = {
          textInput: '',
          colourSet: processText(
            '#fafafa\r#f4f4f5\r#e4e4e7\r#d4d4d8\r#a1a1aa\r#71717a\r#52525b\r#3f3f46\r#27272a\r#18181b',
            14,
          ),
          limit: 14,
        };
        console.log('returnValue:', returnValue);
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        if (action.payload.textInput) {
          const returnValue = { ...state, textInput: action.payload.textInput };
          console.log('returnValue:', returnValue);
          return returnValue;
        }
        return state;
      }
      case 'CLEAR_TAGS': {
        const newSet = new Set(...state.colourSet);
        colourSet.clear();
        const returnValue = { ...state, colourSet: newSet };
        console.log('returnValue:', returnValue);
        return returnValue;
      }
      case 'TOGGLE_TAG':
      default: {
        const newSet = new Set(...state.colourSet);
        if (typeof action.payload === 'string' && colourSet.has(action.payload)) colourSet.delete(action.payload);
        if (typeof action.payload === 'string' && !colourSet.has(action.payload)) colourSet.add(action.payload);
        const returnValue = { ...state, colourSet: newSet };
        console.log('returnValue:', returnValue);
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

// processText(text, limit, setColourSet);
function processHexString(hex: string) {
  if (hex[0] !== '#' || hex.length < 2 || hex.slice(1).search(/#|[^0-9a-fA-F]/) > -1) return '';
  let modifiedHex = hex.length > 7 ? hex.slice(0, 7) : hex;
  if (hex.length < 5) {
    const characters = hex.slice(1);
    modifiedHex = `#${characters.repeat(6 / characters.length)}`;
  }
  if (hex.length > 4 && hex.length < 7) {
    modifiedHex = `#${hex[1].repeat(6)}`;
  }
  return modifiedHex;
}

function hexReducer(acc: Array<string>, curr: string) {
  const processedHex = processHexString(curr);
  if (processedHex.length === 7) acc.push(processedHex);
  return acc;
}

function limitArray(inputArray: string[], limit: number) {
  return inputArray.length > limit ? inputArray.slice(0, limit) : inputArray;
}

function processText(text: string, limit: number) {
  const backgroundColoursArray = limitArray(
    text
      .split(/[ \r\n,]+/)
      .reduce(hexReducer, [])
      .sort(),
    limit,
  );
  return new Set(backgroundColoursArray);
}
