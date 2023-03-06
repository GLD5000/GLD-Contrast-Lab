import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';

export default function ShowButtons() {
  const { showRatio, showPoor, limit, colourMode, dispatchColourBlocks } = useColourBlocksContext();

  const colourModeLabel = `${colourMode}`;
  const ratioLabel = showRatio ? 'Contrast Ratio' : 'Contrast Rating';
  const ratingRatio = showRatio ? 'Ratios' : 'Ratings';
  const poorLabel = showPoor ? `All ${ratingRatio}` : `Usable ${ratingRatio}`;
  const limitLabel = `Up to ${limit} Colours`;

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
    const nextLimit: { [elemName: number]: number } = {
      4: 8,
      8: 12,
      12: 16,
      16: 20,
      20: 4,
    };
    dispatchColourBlocks({ limit: nextLimit[limit] });
  }

  return (
    <div className="sticky left-0 mb-4 flex w-body min-w-body max-w-body flex-row flex-wrap items-center justify-center">
      <div className="flex w-fit items-center gap-2 rounded bg-neutral-200 px-2 dark:bg-neutral-700">
        <b className="w-20 text-center text-base">Show:</b>

        <button
          type="button"
          onClick={handleClickColourMode}
          className="m-2 w-40 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {colourModeLabel}
        </button>

        <button
          type="button"
          onClick={handleClickRatio}
          className="m-2 w-40 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {ratioLabel}
        </button>
        <button
          type="button"
          onClick={handleClickPoor}
          className="m-2 w-40 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {poorLabel}
        </button>
        <button
          type="button"
          onClick={handleClickLimit}
          className="m-2 w-40 shrink-0 rounded p-2 text-current hover:bg-black hover:text-white hover:transition dark:hover:bg-white dark:hover:text-black"
        >
          {limitLabel}
        </button>
      </div>
    </div>
  );
}
