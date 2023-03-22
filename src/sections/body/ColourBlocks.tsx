import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';
import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { luminance } from '../../utilities/colour/luminance';
import ShowButtons from './ShowButtons';
import BlockVisibility from './BlockVisibility';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

function getBlockRow(backgroundColour: string, index: number, array: string[]) {
  const keyA = `${backgroundColour}-${index}`;
  const rowArray = array.map((textColour, number) => {
    const keyB = `${textColour}-${number}`;
    const autoColour = textColour === backgroundColour;
    const textColourMod = autoColour ? autoTextColourFromHex(backgroundColour) : textColour;
    const contrastRatio = Number(getContrastRatioFromHex(backgroundColour, textColourMod).toFixed(2));
    const contrastRating = contrast.makeContrastRating(contrastRatio);
    const bwText = !autoColour && contrastRatio < 4.5;
    return (
      <ColourBlock
        key={`${keyA}-${keyB}`}
        backgroundColour={backgroundColour}
        textColour={bwText ? autoTextColourFromHex(backgroundColour) : textColourMod}
        borderColour={textColour}
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
        className=" grid gap-1 rounded-none  p-1"
      >
        <BlockVisibility hexId={keyA} />
        {rowArray}
      </div>
    );
  });
}

function getColourBlocks(visibleColours: Set<string>, title: string) {
  const returnArrays = createColourBlockArrays(visibleColours);
  return (
    <div className="mx-auto grid h-fit w-fit overflow-x-auto rounded border border-current">
      <div className="h-9 w-full  rounded-none border-b bg-bg-var dark:bg-bg-var-dk">
        <h3 className="m-auto  w-fit">{title}</h3>
      </div>
      <div className="m-4 mx-auto grid w-fit auto-cols-min grid-flow-col grid-rows-1 overflow-clip rounded-xl bg-bg dark:bg-bg-dk ">
        {returnArrays}
      </div>
      <ShowButtons />
    </div>
  );
}
export default function ColourBlocks() {
  const { colourMap } = useColourInputContext();
  const { visibleSet, showPoor, showRatio } = useColourBlocksContext();
  if (!colourMap || colourMap.size < 2) return null;
  const title = `${showPoor ? 'All' : 'Usable'} Contrast ${showRatio ? 'Ratios' : 'Ratings'}`;
  const colourBlocks = getColourBlocks(visibleSet, title);
  return (
    <>
      <section className="grid gap-4">
        <div className="mr-auto grid place-items-start">
          <h2 className=" m-0 text-2xl font-bold">Compare Colours</h2>
          <p className="mt-2 mb-8 text-lg">Customise and Analyse</p>
          <ul className=" list-inside list-disc">
            <li key="blocks-list-a" id="blocks-list-a" className="m-0 mb-1">
              Pick your colours to compare in Hex, RGB, HSL or Relative Luminance.{' '}
            </li>
            <li key="blocks-list-b" id="blocks-list-b" className="m-0 mb-1">
              Choose to see Contrast Ratios or Contrast Ratings (compliant with WCAG 2.1 guidance).
            </li>
          </ul>
        </div>
        {colourBlocks}
      </section>
      <hr className="my-8" />
    </>
  );
}
