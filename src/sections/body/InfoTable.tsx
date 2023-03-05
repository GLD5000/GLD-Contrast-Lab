import { ReactElement } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import { autoTextColour } from '../../utilities/colour/autoTextColour';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { contrast } from '../../utilities/colour/contrastRatio';
import { luminance } from '../../utilities/colour/luminance';

function sortByLuminance(acc: Array<Array<string>>, curr: string) {
  // Build sparse array based on  Math.round(lum * 100)
  const luminanceInteger = Math.round(1000 * luminance.convertHexToLuminance(curr));
  acc[luminanceInteger] = acc[luminanceInteger] === undefined ? [curr] : [...acc[luminanceInteger], curr];
  return acc;
}

function tableReducer(acc: Array<Array<ReactElement>>, curr: string): Array<Array<ReactElement>> {
  const style = { backgroundColor: curr, color: autoTextColour.autoTextColourFromHex(curr) };

  const luminanceFloat = luminance.convertHexToLuminance(curr);
  const currP = (
    <span
      key={`${curr}currP`}
      className=" block w-full min-w-fit border border-neutral-800 p-2 dark:border-neutral-200"
      style={style}
    >
      {curr}
    </span>
  );
  const HSL = (
    <span
      key={`${curr}HSL`}
      className=" block w-full min-w-fit border border-neutral-800 p-2 dark:border-neutral-200"
      style={style}
    >
      {colourSpace.convertHexToHslString(curr)}
    </span>
  );
  const RGB = (
    <span
      key={`${curr}RGB`}
      className=" block w-full min-w-fit border border-neutral-800 p-2 dark:border-neutral-200"
      style={style}
    >
      {colourSpace.convertHextoRgbString(curr)}
    </span>
  );
  const Luminance = (
    <span
      key={`${curr}Luminance`}
      className=" block w-full min-w-fit border border-neutral-800 p-2 dark:border-neutral-200"
      style={style}
    >
      {luminance.convertHexToLuminancePercent(curr)}
    </span>
  );
  const ContrastRatioBlack = (
    <span
      key={`${curr}ContrastRatioBlack`}
      className=" block w-full min-w-fit border border-neutral-800 p-2 dark:border-neutral-200"
      style={style}
    >
      {contrast.getContrastRatio2Dp([0, luminanceFloat])}
    </span>
  );
  const ContrastRatioWhite = (
    <span
      key={`${curr}ContrastRatioWhite`}
      className=" block w-full min-w-fit border border-neutral-800 p-2 dark:border-neutral-200"
      style={style}
    >
      {contrast.getContrastRatio2Dp([1, luminanceFloat])}
    </span>
  );
  const newRow: Array<ReactElement> = [currP, HSL, RGB, Luminance, ContrastRatioBlack, ContrastRatioWhite];
  acc.push(newRow);
  return acc;
}
function getTable(colourArray: string[]) {
  const dataTable = colourArray.reduce(tableReducer, [
    [
      <span key="Hex" className="block min-w-fit border border-neutral-800 p-4 text-xl dark:border-neutral-200">
        Hex
      </span>,
      <span key="HSL" className="block min-w-fit border border-neutral-800 p-4 text-xl dark:border-neutral-200">
        HSL
      </span>,
      <span key="RGB" className="block min-w-fit border border-neutral-800 p-4 text-xl dark:border-neutral-200">
        RGB
      </span>,
      <span key="Luminance" className="block min-w-fit border border-neutral-800 p-4 text-xl dark:border-neutral-200">
        Luminance
      </span>,
      <span key="Black" className="block min-w-fit border border-neutral-800 p-4 text-xl dark:border-neutral-200">
        Contrast Ratio Black
      </span>,
      <span key="White" className="block min-w-fit border border-neutral-800 p-4 text-xl dark:border-neutral-200">
        Contrast Ratio White
      </span>,
    ],
  ]);
  return dataTable;
}

export default function InfoTable() {
  const { colourSet } = useColourInputContext();
  const lumSort = [...colourSet].reduce(sortByLuminance, []).flatMap((x) => x);

  const tableMarkDown = getTable(lumSort);
  return (
    <div className="relative flex w-full overflow-x-auto px-8">
      <div className="w-min-[100%] relative mx-auto grid w-max shrink-0 grid-cols-6 gap-2 p-4 text-center ">
        {tableMarkDown}
      </div>
    </div>
  );
}
