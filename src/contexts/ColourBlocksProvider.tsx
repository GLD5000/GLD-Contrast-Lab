import { createContext, ReactNode, useContext, useReducer, Dispatch } from 'react';

const initialiserA: {
  colourMode: string;
  showRatio: boolean;
  showPoor: boolean;
  limit: number;
  visibleSet: Set<string>;

  dispatchColourBlocks: Dispatch<
    Partial<{
      colourMode: string;
      showRatio: boolean;
      showPoor: boolean;
      limit: number;
      visibleSet: Set<string>;
    }>
  >;
} = {
  colourMode: 'hex',
  showRatio: false,
  showPoor: false,
  limit: 12,
  visibleSet: new Set(''),
  dispatchColourBlocks: () => undefined,
};

const initialiserB: {
  colourMode: string;
  showRatio: boolean;
  showPoor: boolean;
  limit: number;
  visibleSet: Set<string>;
} = {
  colourMode: 'hex',
  showRatio: false,
  showPoor: false,
  limit: 12,
  visibleSet: new Set(''),
};

function useData() {
  const [{ colourMode, showRatio, showPoor, limit, visibleSet }, dispatchColourBlocks] = useReducer(
    (
      state: {
        colourMode: string;
        showRatio: boolean;
        showPoor: boolean;
        limit: number;
        visibleSet: Set<string>;
      },
      action: Partial<{
        colourMode: string;
        showRatio: boolean;
        showPoor: boolean;
        limit: number;
        visibleSet: Set<string>;
      }>,
    ) => ({ ...state, ...action }),
    initialiserB,
  );

  return {
    colourMode,
    showRatio,
    showPoor,
    limit,
    visibleSet,
    dispatchColourBlocks,
  };
}

const ColourBlocks = createContext(initialiserA);
export const useColourBlocksContext = () => useContext(ColourBlocks);
export default function ColourBlocksProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourBlocks.Provider value={data}>{children}</ColourBlocks.Provider>;
}
