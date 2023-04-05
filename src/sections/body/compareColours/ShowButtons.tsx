import { useColourBlocksContext } from '../../../contexts/ColourBlocksProvider';
import { useColourInputContext } from '../../../contexts/ColourInputProvider';

const lookupRatingLabel: { [key: number]: string } = {
  1: 'All',
  3: 'Low+',
  4.5: 'AA+',
  7: 'AAA+',
};

export default function ShowButtons() {
  const { showRatio, contrastRatioLimit, limit, colourMode, visibleSet, dispatchColourBlocks } =
    useColourBlocksContext();
  const { colourMap } = useColourInputContext();
  const colourModeLabel = `${colourMode}:`;
  const ratioLabel = showRatio ? 'Ratios:' : 'Ratings:';
  const poorLabel = showRatio ? `${contrastRatioLimit}+` : lookupRatingLabel[contrastRatioLimit];
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
    const nextLimit: { [key: number]: number } = {
      1: 3,
      3: 4.5,
      4.5: 7,
      7: 1,
    };

    dispatchColourBlocks({ contrastRatioLimit: nextLimit[contrastRatioLimit] });
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
    <div className="mx-auto flex flex-row flex-wrap items-center justify-center gap-2 overflow-clip rounded rounded-t-none ">
      <div className="grid h-10 w-60 grid-cols-2">
        <button
          type="button"
          onClick={handleClickColourMode}
          className="shrink-0 grow basis-0 rounded-full rounded-r-none  border bg-deco p-2  py-2  px-4  text-sm font-semibold text-current hover:bg-txt-low hover:text-bg-var
          hover:transition focus:bg-txt-low  focus:text-bg-var focus:transition  dark:bg-deco-dk hover:dark:bg-txt-main-dk  hover:dark:text-bg-var-dk focus:dark:bg-txt-main-dk focus:dark:text-bg-var-dk"
        >
          {colourModeLabel}
        </button>

        <button
          type="button"
          onClick={handleClickLimit}
          className="shrink-0 grow basis-0 rounded-full rounded-l-none  border bg-deco  p-2  py-2  px-4 text-sm text-current hover:bg-txt-low hover:text-bg-var
          hover:transition focus:bg-txt-low  focus:text-bg-var focus:transition  dark:bg-deco-dk hover:dark:bg-txt-main-dk  hover:dark:text-bg-var-dk focus:dark:bg-txt-main-dk focus:dark:text-bg-var-dk"
        >
          {limitLabel}
        </button>
      </div>
      <div className="grid h-10 w-60 grid-cols-2">
        <button
          type="button"
          onClick={handleClickRatio}
          className="shrink-0 grow basis-0 rounded-full rounded-r-none  border bg-deco p-2 
  py-2  px-4  text-sm font-semibold text-current hover:bg-txt-low hover:text-bg-var
   hover:transition focus:bg-txt-low  focus:text-bg-var focus:transition  dark:bg-deco-dk hover:dark:bg-txt-main-dk  hover:dark:text-bg-var-dk focus:dark:bg-txt-main-dk focus:dark:text-bg-var-dk
  "
        >
          {ratioLabel}
        </button>
        <button
          type="button"
          onClick={handleClickPoor}
          className="shrink-0 grow basis-0 rounded-full rounded-l-none border bg-deco p-2  py-2  px-4 text-sm text-current hover:bg-txt-low hover:text-bg-var
  hover:transition focus:bg-txt-low  focus:text-bg-var focus:transition  dark:bg-deco-dk hover:dark:bg-txt-main-dk  hover:dark:text-bg-var-dk focus:dark:bg-txt-main-dk focus:dark:text-bg-var-dk"
        >
          {poorLabel}
        </button>
      </div>
    </div>
  );
}
