import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

export default function ShowButtons() {
  const { showRatio, showPoor, limit, colourMode, visibleSet, dispatchColourBlocks } = useColourBlocksContext();
  const { colourSet } = useColourInputContext();
  const colourModeLabel = `${colourMode}`;
  const ratioLabel = showRatio ? 'Contrast' : 'Rating';
  const ratingRatio = showRatio ? 'Ratios' : 'Ratings';
  const poorLabel = showPoor ? `All ${ratingRatio}` : `Safe ${ratingRatio}`;
  const limitLabel = limit;

  function handleClickColourMode() {
    const nextMode: { [key: string]: string } = {
      hex: 'luminance',
      luminance: 'hsl',
      hsl: 'rgb',
      rgb: 'hex',
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
      limit === 'Selecting...' && visibleSet.size === colourSet.size ? 'All Colours' : limitLookup[limit];
    if (nextLimit === 'All Colours') {
      dispatchColourBlocks({ visibleSet: new Set(colourSet) });
    }
    dispatchColourBlocks({ limit: nextLimit });
  }

  return (
    <div className="sticky left-0 flex w-body min-w-body max-w-body  items-center overflow-x-auto">
      <div className="mx-auto flex w-fit flex-row flex-wrap items-center justify-around gap-1 rounded">
        <button
          type="button"
          onClick={handleClickColourMode}
          className="m-2 w-28 shrink-0 rounded border p-2 text-sm text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {colourModeLabel}
        </button>

        <button
          type="button"
          onClick={handleClickRatio}
          className="m-2 w-28 shrink-0 rounded border p-2 text-sm text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {ratioLabel}
        </button>
        <button
          type="button"
          onClick={handleClickPoor}
          className="m-2 w-28 shrink-0 rounded border p-2 text-sm text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {poorLabel}
        </button>
        <button
          type="button"
          onClick={handleClickLimit}
          className="m-2 w-28 shrink-0 rounded border p-2 text-sm text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {limitLabel}
        </button>
      </div>
    </div>
  );
}
