import { Dispatch } from 'react';
import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { luminance } from '../../utilities/colour/luminance';

function getBlockRow(backgroundColour: string, index: number, array: string[]) {
  const keyA = `${backgroundColour}${index}`;
  const rowArray = array.map((textColour, number) => {
    const keyB = `${textColour}${number}`;
    const autoColour = textColour === backgroundColour;
    const textColourMod = autoColour ? autoTextColourFromHex(backgroundColour) : textColour;
    const contrastRatio = Number(getContrastRatioFromHex(backgroundColour, textColourMod).toFixed(2));
    const contrastRating = contrast.makeContrastRating(contrastRatio);

    return (
      <ColourBlock
        key={`${keyA}-${keyB}`}
        backgroundColour={backgroundColour}
        textColour={textColourMod}
        autoColour={autoColour}
        contrastRating={contrastRating}
        contrastRatio={contrastRatio}
      />
    );
  });
  return { keyA, rowArray };
}

function sortByLuminance(acc: Array<Array<string>>, curr: string) {
  // Build sparse array based on  Math.round(lum * 100)
  const luminanceInteger = Math.round(1000 * luminance.convertHexToLuminance(curr));
  acc[luminanceInteger] = acc[luminanceInteger] === undefined ? [curr] : [...acc[luminanceInteger], curr];
  return acc;
}

function createColourBlockArrays(coloursArray: Set<string>, limit: number) {
  const lumSort = [...coloursArray].reduce(sortByLuminance, []).flatMap((x) => x);
  return lumSort.slice(0, limit).map((backgroundColour, index, array) => {
    const { keyA, rowArray } = getBlockRow(backgroundColour, index, array);
    return (
      <div
        key={`${backgroundColour}-${keyA}`}
        style={{ backgroundColor: backgroundColour }}
        className=" grid rounded border-2 border-current p-2"
      >
        {rowArray}
      </div>
    );
  });
}

function getColourBlocks(
  colourSet: Set<string>,
  colourMode: string,
  showRatio: boolean,
  showPoor: boolean,
  limit: number,
  dispatchColourBlocks: Dispatch<
    Partial<{
      colourMode: string;
      showRatio: boolean;
      showPoor: boolean;
      limit: number;
      visibleSet: Set<string>;
    }>
  >,
) {
  const returnArrays = createColourBlockArrays(colourSet, limit);
  const colourModeLabel = `Mode: ${colourMode}`;
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
    <div className=" grid w-full  items-center justify-center self-center overflow-auto rounded-none">
      <div className="sticky left-0 flex w-body min-w-body max-w-body flex-row flex-wrap  justify-center p-4">
        <button
          type="button"
          onClick={handleClickColourMode}
          className="m-2 shrink-0 grow basis-0 rounded border border-current p-2 text-current"
        >
          {colourModeLabel}
        </button>

        <button
          type="button"
          onClick={handleClickRatio}
          className="m-2 shrink-0 grow basis-0 rounded border border-current p-2 text-current"
        >
          {ratioLabel}
        </button>
        <button
          type="button"
          onClick={handleClickPoor}
          className="m-2 shrink-0 grow basis-0 rounded border border-current p-2 text-current"
        >
          {poorLabel}
        </button>
        <button
          type="button"
          onClick={handleClickLimit}
          className="m-2 shrink-0 grow basis-0 rounded border border-current p-2 text-current"
        >
          {limitLabel}
        </button>
      </div>
      <div className="mx-auto grid w-fit auto-cols-min grid-flow-col grid-rows-1 gap-2 overflow-auto rounded p-4">
        {returnArrays}
      </div>
    </div>
  );
}
export default function ColourBlocks() {
  const { showRatio, showPoor, limit, colourMode, dispatchColourBlocks } = useColourBlocksContext();

  const { colourSet } = useColourInputContext();
  if ([...colourSet][0] === undefined) return null;
  const colourBlocks = getColourBlocks(colourSet, colourMode, showRatio, showPoor, limit, dispatchColourBlocks);
  return colourBlocks;
}
