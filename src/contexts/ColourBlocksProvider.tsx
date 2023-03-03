import { createContext, ReactNode, useContext, useReducer, Dispatch } from 'react';

const initialiserA: {
  showRatio: boolean;
  showPoor: boolean;
  limit: number;
  visibleSet: Set<string>;

  dispatchColourBlocks: Dispatch<
    Partial<{
      showRatio: boolean;
      showPoor: boolean;
      limit: number;
      visibleSet: Set<string>;
    }>
  >;
} = {
  showRatio: false,
  showPoor: false,
  limit: 12,
  visibleSet: new Set(''),
  dispatchColourBlocks: () => undefined,
};

const initialiserB: {
  showRatio: boolean;
  showPoor: boolean;
  limit: number;
  visibleSet: Set<string>;
} = {
  showRatio: false,
  showPoor: false,
  limit: 12,
  visibleSet: new Set(''),
};

function useData() {
  const [{ showRatio, showPoor, limit, visibleSet }, dispatchColourBlocks] = useReducer(
    (
      state: { showRatio: boolean; showPoor: boolean; limit: number; visibleSet: Set<string> },
      action: Partial<{ showRatio: boolean; showPoor: boolean; limit: number; visibleSet: Set<string> }>,
    ) => ({ ...state, ...action }),
    initialiserB,
  );

  return {
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
