import { useEffect } from 'react';
import ColourBlock from './ColourBlock';
import { contrast } from '../../utilities/colour/contrastRatio';
import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { luminance } from '../../utilities/colour/luminance';
import ShowButtons from './ShowButtons';
import BlockVisibility from './BlockVisibility';
import { ColourMap, useColourInputContext } from '../../contexts/ColourInputProvider';
// import BlocksKey from './BlocksKey';
import ColourDemo from './inspector/ColourDemo';

const textColourLookup: { [key: string]: string } = {
  Black: '#000000',
  White: '#ffffff',
};

function getBlockRow(backgroundColour: string, index: number, array: string[], referenceMap: ColourMap) {
  const keyA = `${backgroundColour}-${index}`;
  const colourObject = referenceMap.get(backgroundColour);
  const contrastRatios = colourObject?.contrastRatios;
  const autoColourOut = colourObject?.Autocolour;
  const autoTextColour = autoColourOut ? textColourLookup[autoColourOut] : '#ffffff';
  function blockRowMapper(borderColour: string, number: number) {
    const keyB = `${borderColour}-${number}`;
    const autoColour = borderColour === backgroundColour;
    const contrastRatio = contrastRatios ? contrastRatios.get(borderColour) || 1 : 1;
    const textColour = autoColour || contrastRatio < 4.5 ? autoTextColour : borderColour;
    const contrastRating = contrast.makeContrastRating(contrastRatio);
    return (
      <ColourBlock
        key={`${keyA}-${keyB}`}
        backgroundColour={backgroundColour}
        textColour={textColour}
        borderColour={borderColour}
        autoColour={autoColour}
        contrastRating={contrastRating}
        contrastRatio={contrastRatio}
      />
    );
  }
  const rowArray = array.map(blockRowMapper);
  return { keyA, rowArray };
}

function sortByLuminance(acc: Array<Array<string>>, curr: string) {
  const luminanceInteger = Math.round(1000 * luminance.convertHexToLuminance(curr));
  acc[luminanceInteger] = acc[luminanceInteger] === undefined ? [curr] : [...acc[luminanceInteger], curr];
  return acc;
}

function createColourBlockArrays(coloursSet: Set<string>, storedMap: ColourMap) {
  const lumSort = [...coloursSet].reduce(sortByLuminance, []).flatMap((x) => x);
  return lumSort.map((backgroundColour, index, array) => {
    const { keyA, rowArray } = getBlockRow(backgroundColour, index, array, storedMap);
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

// function getComboMetaData(combos: Map<string, ColourCombo>) {
//   const total = combos.size;
//   let border = 0;
//   let largeText = 0;
//   let smallText = 0;
//   combos.forEach((object) => {
//     const { ratio } = object;
//     if (ratio >= 3) border += 1;
//     if (ratio >= 4.5) largeText += 1;
//     if (ratio >= 7) smallText += 1;
//   });
//   return {
//     total,
//     border,
//     largeText,
//     smallText,
//   };
// }

export default function ColourBlocks() {
  const { colourMap } = useColourInputContext();
  const { visibleSet, currentCombo, dispatchColourBlocks } = useColourBlocksContext();
  useEffect(() => {
    let mounted = true;
    if (mounted && colourMap && colourMap.size === 2 && currentCombo === '')
      dispatchColourBlocks({ currentCombo: [...colourMap.keys()].sort().join('/') });

    return () => {
      mounted = false;
    };
  }, [colourMap, currentCombo, dispatchColourBlocks]);
  if (!colourMap || colourMap.size < 2) return null;

  // const { total, border, largeText, smallText } = getComboMetaData(combos);
  //   const subheading = `${total} combinations:
  // ${border} non-text, ${largeText} AA+ combinations, ${smallText} AAA+ combinations`;
  const returnArrays = createColourBlockArrays(visibleSet, colourMap);
  return (
    <>
      <section className="grid content-center gap-4 ">
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
        <div
          className="relative mx-auto flex h-fit w-full flex-row flex-wrap gap-2 rounded border-none border-inherit 
          "
        >
          {/* <h2 className="mx-auto mb-0 w-fit text-2xl font-bold">Combinations</h2> */}
          {/* <h3 className="mx-auto mt-2 mb-8 text-lg">{subheading}</h3> */}
          <div className="mx-auto mt-12">
            <ColourDemo />
          </div>
          <div className="mx-auto grid h-min grow-0 gap-2">
            <ShowButtons />
            <div className="mx-auto h-fit w-fit max-w-full overflow-x-auto rounded-[2.4rem] border border-border  bg-inherit ">
              <div className="mx-auto grid w-fit auto-cols-min grid-flow-col grid-rows-1 overflow-clip rounded-none ">
                {returnArrays}
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-8" />
    </>
  );
}
