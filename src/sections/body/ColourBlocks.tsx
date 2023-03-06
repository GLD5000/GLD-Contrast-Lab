import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { luminance } from '../../utilities/colour/luminance';
import ShowButtons from './ShowButtons';

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
        className=" grid gap-1 rounded border-2 border-current p-2"
      >
        {rowArray}
      </div>
    );
  });
}

function getColourBlocks(colourSet: Set<string>, limit: number) {
  const returnArrays = createColourBlockArrays(colourSet, limit);
  return (
    <div className=" mt-8 grid  w-full items-center justify-center gap-4 self-center overflow-auto rounded-none">
      <div className="mx-auto grid w-fit auto-cols-min grid-flow-col grid-rows-1 gap-1 overflow-auto rounded">
        {returnArrays}
      </div>
      <ShowButtons />
    </div>
  );
}
export default function ColourBlocks() {
  const { limit } = useColourBlocksContext();

  const { colourSet } = useColourInputContext();
  if ([...colourSet][0] === undefined) return <b className="m-auto text-xl">Nothing to show yet!</b>;
  const colourBlocks = getColourBlocks(colourSet, limit);
  return colourBlocks;
}
