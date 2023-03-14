import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

export default function ShowButtons() {
  const { showRatio, showPoor, limit, colourMode, visibleSet, dispatchColourBlocks } = useColourBlocksContext();
  const { colourSet } = useColourInputContext();
  const colourModeLabel = `${colourMode}`;
  const ratioLabel = showRatio ? 'Ratio' : 'Rating';
  const ratingRatio = showRatio ? 'Ratios' : 'Ratings';
  const poorLabel = showPoor ? `All ${ratingRatio}` : `Safe ${ratingRatio}`;
  const limitLabel = limit;

  function handleClickColourMode() {
    const nextMode: { [key: string]: string } = {
      Hex: 'Luminance',
      Luminance: 'HSL',
      HSL: 'RGB',
      RGB: 'Hex',
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
      'All Colours': 'Selecting...',
      'Selecting...': 'Selection',
      Selection: 'All Colours',
    };
    const nextLimit =
      colourSet && visibleSet && limit === 'Selecting...' && visibleSet.size === colourSet.size
        ? 'All Colours'
        : limitLookup[limit];
    if (nextLimit === 'All Colours') {
      dispatchColourBlocks({ visibleSet: new Set(colourSet) });
    }
    dispatchColourBlocks({ limit: nextLimit });
  }

  return (
    <div className="flex items-center overflow-x-auto">
      <div className="mx-auto flex w-fit flex-row flex-wrap items-center justify-center gap-1 rounded">
        <button
          type="button"
          onClick={handleClickColourMode}
          className="w-28 shrink-0 rounded bg-neutral-300 p-2 text-sm  text-current hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
        >
          {colourModeLabel}
        </button>

        <button
          type="button"
          onClick={handleClickRatio}
          className="w-28 shrink-0 rounded bg-neutral-300 p-2 text-sm  text-current hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
        >
          {ratioLabel}
        </button>
        <button
          type="button"
          onClick={handleClickPoor}
          className="w-28 shrink-0 rounded bg-neutral-300 p-2 text-sm  text-current hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
        >
          {poorLabel}
        </button>
        <button
          type="button"
          onClick={handleClickLimit}
          className="w-28 shrink-0 rounded bg-neutral-300 p-2 text-sm  text-current hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
        >
          {limitLabel}
        </button>
      </div>
    </div>
  );
}
