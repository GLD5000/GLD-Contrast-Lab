import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';
import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { luminance } from '../../utilities/colour/luminance';
import ShowButtons from './ShowButtons';
import BlockVisibility from './BlockVisibility';

function getBlockRow(backgroundColour: string, index: number, array: string[], showPoor: boolean) {
  const keyA = `${backgroundColour}-${index}`;
  const rowArray = array.map((textColour, number) => {
    const keyB = `${textColour}-${number}`;
    const autoColour = textColour === backgroundColour;
    const textColourMod = autoColour ? autoTextColourFromHex(backgroundColour) : textColour;
    const contrastRatio = Number(getContrastRatioFromHex(backgroundColour, textColourMod).toFixed(2));
    const contrastRating = contrast.makeContrastRating(contrastRatio);

    return (
      <ColourBlock
        key={`${keyA}-${keyB}`}
        backgroundColour={backgroundColour}
        textColour={
          showPoor && !autoColour && contrastRatio < 3 ? autoTextColourFromHex(backgroundColour) : textColourMod
        }
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

function createColourBlockArrays(coloursArray: Set<string>, showPoor: boolean) {
  const lumSort = [...coloursArray].reduce(sortByLuminance, []).flatMap((x) => x);
  return lumSort.map((backgroundColour, index, array) => {
    const { keyA, rowArray } = getBlockRow(backgroundColour, index, array, showPoor);
    return (
      <div
        key={`${backgroundColour}-${keyA}`}
        style={{ backgroundColor: backgroundColour }}
        className=" grid gap-1 rounded border border-current p-1"
      >
        {rowArray}
        <BlockVisibility hexId={keyA} />
      </div>
    );
  });
}

function getColourBlocks(colourSet: Set<string>, showPoor: boolean) {
  const returnArrays = createColourBlockArrays(colourSet, showPoor);
  return (
    <>
      <ShowButtons />
      <div className="grid  w-full gap-2 overflow-auto rounded-none">
        <div className="mx-auto grid w-fit auto-cols-min grid-flow-col grid-rows-1 gap-1 overflow-clip rounded">
          {returnArrays}
        </div>
      </div>
    </>
  );
}
export default function ColourBlocks() {
  const { visibleSet, showPoor } = useColourBlocksContext();
  if (visibleSet.size === 0) return null;

  const colourBlocks = getColourBlocks(visibleSet, showPoor);
  return (
    <section className="grid gap-4">
      <div className="mr-auto grid place-items-start">
        <h2 className=" m-0 text-2xl font-bold">Compare Colours</h2>
        <p className="mt-2 mb-8 text-lg">Customise and Analyse.</p>
        <p className="m-0">Pick your colours to compare in Hex, RGB, HSL or Relative Luminance. </p>
        <p className="m-0">Choose to Contrast Ratios see or Contrast Ratings (compliant with WCAG 2.1 guidance).</p>
      </div>

      {colourBlocks}
    </section>
  );
}
