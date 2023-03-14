import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { useColourInputContext } from './ColourInputProvider';

const initialiserA: {
  colourMode: string;
  showRatio: boolean;
  showPoor: boolean;

  limit: string;
  visibleSet: Set<string>;

  dispatchColourBlocks: Dispatch<
    Partial<{
      colourMode: string;
      showRatio: boolean;
      showPoor: boolean;

      limit: string;
      visibleSet: Set<string>;
    }>
  >;
} = {
  colourMode: 'Hex',
  showRatio: false,
  showPoor: false,
  limit: 'All Colours',
  visibleSet: new Set(''),
  dispatchColourBlocks: () => undefined,
};

const initialiserB: {
  colourMode: string;
  showRatio: boolean;
  showPoor: boolean;

  limit: string;
  visibleSet: Set<string>;
} = {
  colourMode: 'Hex',
  showRatio: false,
  showPoor: false,
  limit: 'All Colours',
  visibleSet: new Set(''),
};

function useData() {
  const { colourMap } = useColourInputContext();
  const [{ colourMode, showRatio, showPoor, limit, visibleSet }, dispatchColourBlocks] = useReducer(
    (
      state: {
        colourMode: string;
        showRatio: boolean;
        showPoor: boolean;

        limit: string;
        visibleSet: Set<string>;
      },
      action: Partial<{
        colourMode: string;
        showRatio: boolean;
        showPoor: boolean;

        limit: string;
        visibleSet: Set<string>;
      }>,
    ) => ({ ...state, ...action }),
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
    dispatchColourBlocks,
  };
}

const ColourBlocks = createContext(initialiserA);
export const useColourBlocksContext = () => useContext(ColourBlocks);
export default function ColourBlocksProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourBlocks.Provider value={data}>{children}</ColourBlocks.Provider>;
}
