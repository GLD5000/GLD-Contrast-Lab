import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';

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
          '#fff1f2\r#ffe4e6\r#fecdd3\r#fda4af\r#fb7185\r#f43f5e\r#e11d48\r#be123c\r#9f1239\r#881337\r',
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

function processHexString(hex: string) {
  if (hex[0] !== '#' || hex.length < 2 || hex.slice(1).search(/#|[^0-9a-fA-F]/) > -1) return hex;
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

function hexReducer(acc: { processedText: string; processedArray: string[] }, curr: string) {
  const processedHex = processHexString(curr);
  if (processedHex.length === 7 && processedHex[0] === '#') {
    acc.processedArray.push(processedHex);
    return acc;
  }

  acc.processedText += acc.processedText.length > 0 ? ` ${curr}` : curr;
  return acc;
}

function processText(text: string | undefined) {
  if (text === undefined || text.search(/[ \r\n,]+/) === -1) {
    console.log(text);
    return { processedText: text, processedArray: [] };
  }
  const shouldSkipLastElement = text[text.length - 1].search(/[ \r\n,]/) === -1;
  const splitText = text.split(/[ \r\n,]+/);
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
