import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';
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
  const luminanceInteger = Math.round(1000 * luminance.convertHexToLuminance(curr));
  acc[luminanceInteger] = acc[luminanceInteger] === undefined ? [curr] : [...acc[luminanceInteger], curr];
  return acc;
}

function createColourBlockArrays(coloursArray: Set<string>) {
  const lumSort = [...coloursArray].reduce(sortByLuminance, []).flatMap((x) => x);
  return lumSort.map((backgroundColour, index, array) => {
    const { keyA, rowArray } = getBlockRow(backgroundColour, index, array);
    return (
      <div
        key={`${backgroundColour}-${keyA}`}
        style={{ backgroundColor: backgroundColour }}
        className=" grid gap-1 rounded border border-current p-2"
      >
        {rowArray}
      </div>
    );
  });
}

function getColourBlocks(colourSet: Set<string>) {
  const returnArrays =
    colourSet.size > 0 ? (
      createColourBlockArrays(colourSet)
    ) : (
      <b className="w-90 m-auto text-center text-xl">Add Colours</b>
    );

  return (
    <div className=" mt-8 grid  w-full items-center justify-center gap-4 self-center overflow-auto rounded-none">
      <ShowButtons />
      <div className="mx-auto grid w-fit auto-cols-min grid-flow-col grid-rows-1 gap-1 overflow-auto rounded">
        {returnArrays}
      </div>
    </div>
  );
}
export default function ColourBlocks() {
  const { visibleSet } = useColourBlocksContext();

  const colourBlocks = getColourBlocks(visibleSet);
  return colourBlocks;
}
