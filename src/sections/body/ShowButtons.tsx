import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import VisibleList from './VisibleList';

export default function ShowButtons() {
  const { showRatio, showPoor, limit, colourMode, dispatchColourBlocks } = useColourBlocksContext();
  const { colourSet } = useColourInputContext();
  const colourModeLabel = `${colourMode}`;
  const ratioLabel = showRatio ? 'Contrast Ratio' : 'Contrast Rating';
  const ratingRatio = showRatio ? 'Ratios' : 'Ratings';
  const poorLabel = showPoor ? `All ${ratingRatio}` : `Usable ${ratingRatio}`;
  const limitLabel = limit ? 'Selection' : 'All Colours';

  function handleClickColourMode() {
    const nextMode: { [elemName: string]: string } = {
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
    if (limit === true) {
      dispatchColourBlocks({ visibleSet: new Set(colourSet) });
    }
    dispatchColourBlocks({ limit: !limit });
  }

  return (
    <>
      <div className="sticky left-0 flex w-body min-w-body max-w-body  items-center overflow-x-auto">
        <div className="mx-auto flex w-fit flex-row flex-wrap items-center justify-around gap-2 rounded bg-neutral-200 dark:bg-neutral-700">
          {/* <b className="w-20 text-center text-base">Show:</b> */}

          <button
            type="button"
            onClick={handleClickColourMode}
            className="m-2 w-36 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
          >
            {colourModeLabel}
          </button>

          <button
            type="button"
            onClick={handleClickRatio}
            className="m-2 w-36 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
          >
            {ratioLabel}
          </button>
          <button
            type="button"
            onClick={handleClickPoor}
            className="m-2 w-36 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
          >
            {poorLabel}
          </button>
          <button
            type="button"
            onClick={handleClickLimit}
            className="m-2 w-36 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
          >
            {limitLabel}
          </button>
        </div>
      </div>
      {limit && <VisibleList />}
    </>
  );
}
