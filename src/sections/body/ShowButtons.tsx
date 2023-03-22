import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

export default function ShowButtons() {
  const { showRatio, showPoor, limit, colourMode, visibleSet, dispatchColourBlocks } = useColourBlocksContext();
  const { colourMap } = useColourInputContext();
  const colourModeLabel = `${colourMode}:`;
  const ratioLabel = showRatio ? 'Ratios:' : 'Ratings:';
  const poorLabel = showPoor ? `All` : `Safe`;
  const limitLabel = limit;

  function handleClickColourMode() {
    const nextMode: { [key: string]: string } = {
      Name: 'Hex',
      Hex: 'Luminance',
      Luminance: 'HSL',
      HSL: 'RGB',
      RGB: 'Name',
    };

    dispatchColourBlocks({ colourMode: nextMode[colourMode] });
  }

  function handleClickRatio() {
    dispatchColourBlocks({ showRatio: !showRatio });
  }
  function handleClickPoor() {
    dispatchColourBlocks({ showPoor: !showPoor });
  }
  function handleClickLimit() {
    const limitLookup: { [key: string]: string } = {
      All: 'Selecting...',
      'Selecting...': 'Selection',
      Selection: 'All',
    };
    const nextLimit =
      colourMap && visibleSet && limit === 'Selecting...' && visibleSet.size === colourMap.size
        ? 'All'
        : limitLookup[limit];
    if (nextLimit === 'All') {
      const keysArray = colourMap !== undefined ? [...colourMap.keys()] : undefined;
      if (keysArray) dispatchColourBlocks({ visibleSet: new Set(keysArray) });
    }
    dispatchColourBlocks({ limit: nextLimit });
  }

  return (
    <div className="flex items-center ">
      <div className="mx-auto flex w-full min-w-[24rem]  flex-row flex-wrap items-center justify-center rounded-none border-t ">
        <button
          type="button"
          onClick={handleClickRatio}
          className="shrink-0 grow basis-0 rounded-none bg-bg-var p-2 text-sm font-semibold text-current hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-bg-var-dk  hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
        >
          {ratioLabel}
        </button>
        <button
          type="button"
          onClick={handleClickPoor}
          className="shrink-0 grow basis-0 rounded-none bg-bg-var p-2 text-sm text-current  hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-bg-var-dk  hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
        >
          {poorLabel}
        </button>
        <button
          type="button"
          onClick={handleClickColourMode}
          className="shrink-0 grow basis-0 rounded-none bg-bg-var p-2 text-sm font-semibold text-current hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-bg-var-dk  hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
        >
          {colourModeLabel}
        </button>

        <button
          type="button"
          onClick={handleClickLimit}
          className="shrink-0 grow basis-0 rounded-none bg-bg-var p-2 text-sm text-current  hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-bg-var-dk  hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
        >
          {limitLabel}
        </button>
      </div>
    </div>
  );
}
