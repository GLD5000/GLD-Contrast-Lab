import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { useColourInputContext } from './ColourInputProvider';

export interface ColourCombo {
  colours: string[];
  ratio: number;
  rating: string;
}

export interface BlocksState {
  colourMode: string;
  showRatio: boolean;
  contrastRatioLimit: number;
  combos: Map<string, ColourCombo>;
  currentCombo: string;
  limit: string;
  visibleSet: Set<string>;
}

export interface BlockPayloadOptions extends BlocksState {
  type: string;
  key: string;
  value: ColourCombo;
}

export type BlocksPayload = Partial<BlockPayloadOptions>;

export interface BlocksContext extends BlocksState {
  dispatchColourBlocks: Dispatch<BlocksPayload>;
}

const initialiserContext: BlocksContext = {
  colourMode: 'Name',
  showRatio: false,
  contrastRatioLimit: 1,
  limit: 'All',
  visibleSet: new Set(),
  combos: new Map(),
  currentCombo: '',
  dispatchColourBlocks: () => undefined,
};

const initialiserState: BlocksState = {
  colourMode: 'Name',
  showRatio: false,
  contrastRatioLimit: 1,
  limit: 'All',
  visibleSet: new Set(),
  combos: new Map(),
  currentCombo: '',
};

function colourBlocksReducer(state: BlocksState, action: BlocksPayload) {
  const switchString = action.type ? action.type : 'default';
  switch (switchString) {
    case 'ADD_COMBO': {
      const mapCopy = new Map([...state.combos]);
      const keyIn = action.key;
      const valueIn = action.value;
      if (keyIn && valueIn && !mapCopy.has(keyIn)) {
        mapCopy.set(keyIn, valueIn);
        return { ...state, combos: mapCopy };
      }
      return { ...state };
    }
    default:
      console.log('action:', action);
      return { ...state, ...action };
  }
}

function useData() {
  const { colourMap } = useColourInputContext();
  const [{ colourMode, showRatio, contrastRatioLimit, limit, visibleSet, combos, currentCombo }, dispatchColourBlocks] =
    useReducer(colourBlocksReducer, initialiserState);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const keysArray = colourMap !== undefined ? [...colourMap.keys()] : undefined;
      if (keysArray) dispatchColourBlocks({ visibleSet: new Set(keysArray) });
    }
    return () => {
      mounted = false;
    };
  }, [colourMap]);

  return {
    colourMode,
    showRatio,
    contrastRatioLimit,
    limit,
    visibleSet,
    combos,
    currentCombo,
    dispatchColourBlocks,
  };
}

const ColourBlocks = createContext(initialiserContext);
export const useColourBlocksContext = () => useContext(ColourBlocks);
export default function ColourBlocksProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourBlocks.Provider value={data}>{children}</ColourBlocks.Provider>;
}
