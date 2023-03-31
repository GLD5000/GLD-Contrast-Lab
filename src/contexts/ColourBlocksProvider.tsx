import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { useColourInputContext } from './ColourInputProvider';

interface ColourCombo {
  colours: string[];
  ratio: number;
  rating: string;
  suitability: string;
}

export interface BlocksState {
  colourMode: string;
  showRatio: boolean;
  showPoor: boolean;
  combos: Map<string, ColourCombo>;
  limit: string;
  visibleSet: Set<string>;
}

export interface BlockPayloadOptions extends BlocksState {
  type: string;
}

export type BlocksPayload = Partial<BlockPayloadOptions>;

export interface BlocksContext extends BlocksState {
  dispatchColourBlocks: Dispatch<BlocksPayload>;
}

const initialiserA: BlocksContext = {
  colourMode: 'Name',
  showRatio: false,
  showPoor: true,
  limit: 'All',
  visibleSet: new Set(),
  combos: new Map(),
  dispatchColourBlocks: () => undefined,
};

const initialiserB: BlocksState = {
  colourMode: 'Name',
  showRatio: false,
  showPoor: true,
  limit: 'All',
  visibleSet: new Set(),
  combos: new Map(),
};

function colourBlocksReducer(state: BlocksState, action: BlocksPayload) {
  const switchString = action.type ? action.type : 'default';
  switch (switchString) {
    case 'ADD_COMBO':
      return { ...state, ...action };

    default:
      return { ...state, ...action };
  }
}

function useData() {
  const { colourMap } = useColourInputContext();
  const [{ colourMode, showRatio, showPoor, limit, visibleSet, combos }, dispatchColourBlocks] = useReducer(
    colourBlocksReducer,
    initialiserB,
  );

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
    showPoor,
    limit,
    visibleSet,
    combos,
    dispatchColourBlocks,
  };
}

const ColourBlocks = createContext(initialiserA);
export const useColourBlocksContext = () => useContext(ColourBlocks);
export default function ColourBlocksProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourBlocks.Provider value={data}>{children}</ColourBlocks.Provider>;
}
