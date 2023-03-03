import { Dispatch } from 'react';
import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';

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

function createColourBlockArrays(coloursArray: Set<string>) {
  return [...coloursArray].sort().map((backgroundColour, index, array) => {
    const { keyA, rowArray } = getBlockRow(backgroundColour, index, array);
    return (
      <div
        key={`${backgroundColour}-${keyA}`}
        style={{ backgroundColor: backgroundColour }}
        className=" flex flex-col rounded-none p-4"
      >
        {rowArray}
      </div>
    );
  });
}

function getColourBlocks(
  colourSet: Set<string>,
  showRatio: boolean,
  showPoor: boolean,
  dispatchColourBlocks: Dispatch<
    Partial<{
      showRatio: boolean;
      showPoor: boolean;
      limit: number;
      visibleSet: Set<string>;
    }>
  >,
) {
  const returnArrays = createColourBlockArrays(colourSet);
  const ratioLabel = showRatio ? 'Contrast Ratio' : 'Contrast Rating';
  const ratingRatio = showRatio ? 'Ratios' : 'Ratings';
  const poorLabel = showPoor ? `All ${ratingRatio}` : `Usable ${ratingRatio}`;

  function handleClickRatio() {
    dispatchColourBlocks({ showRatio: !showRatio });
  }
  function handleClickPoor() {
    dispatchColourBlocks({ showPoor: !showPoor });
  }

  return (
    <div className=" grid w-full  justify-center self-center overflow-auto  rounded-none">
      <div className="flex flex-row flex-wrap justify-center">
        <button type="button" onClick={handleClickRatio} className="m-2 rounded border border-current p-2 text-current">
          {ratioLabel}
        </button>
        <button type="button" onClick={handleClickPoor} className="m-2 rounded border border-current p-2 text-current">
          {poorLabel}
        </button>
      </div>
      <div className="flex h-fit w-fit gap-2 overflow-hidden rounded-xl">{returnArrays}</div>
    </div>
  );
}
export default function ColourBlocks() {
  const { showRatio, showPoor, dispatchColourBlocks } = useColourBlocksContext();

  const { colourSet } = useColourInputContext();
  if ([...colourSet][0] === undefined) return null;
  const colourBlocks = getColourBlocks(colourSet, showRatio, showPoor, dispatchColourBlocks);
  return colourBlocks;
}
