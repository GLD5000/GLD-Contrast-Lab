import { ReactElement } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import { autoTextColour } from '../../utilities/colour/autoTextColour';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { contrast } from '../../utilities/colour/contrastRatio';
import { luminance } from '../../utilities/colour/luminance';

function sortByLuminance(acc: Array<Array<string>>, curr: string) {
  const luminanceInteger = Math.round(1000 * luminance.convertHexToLuminance(curr));
  acc[luminanceInteger] = acc[luminanceInteger] === undefined ? [curr] : [...acc[luminanceInteger], curr];
  return acc;
}

function tableReducer(acc: Array<Array<ReactElement>>, curr: string): Array<Array<ReactElement>> {
  const classNames = 'block grow shrink-0 basis-0 w-full min-w-[12rem] p-4  ';
  const luminanceFloat = luminance.convertHexToLuminance(curr);
  const currP = (
    <span key={`${curr}-currP`} className={`${classNames}`}>
      {curr}
    </span>
  );
  const HSL = (
    <span key={`${curr}-HSL`} className={`${classNames}`}>
      {colourSpace.convertHexToHslString(curr)}
    </span>
  );
  const RGB = (
    <span key={`${curr}-RGB`} className={`${classNames}`}>
      {colourSpace.convertHextoRgbString(curr)}
    </span>
  );
  const Luminance = (
    <span key={`${curr}-Luminance`} className={`${classNames}`}>
      {luminance.convertHexToLuminancePercent(curr)}
    </span>
  );
  const ContrastRatioBlack = (
    <span key={`${curr}-ContrastRatioBlack`} className={`${classNames}`}>
      {contrast.getContrastRatio2Dp([0, luminanceFloat])}
    </span>
  );
  const ContrastRatioWhite = (
    <span key={`${curr}-ContrastRatioWhite`} className={`${classNames}`}>
      {contrast.getContrastRatio2Dp([1, luminanceFloat])}
    </span>
  );
  const newRow: Array<ReactElement> = [currP, HSL, RGB, Luminance, ContrastRatioBlack, ContrastRatioWhite];
  acc.push(newRow);
  return acc;
}
function getTable(colourArray: string[]) {
  const classNames = 'block basis-0 shrink-0 grow min-w-max w-full min-w-fit p-4 text-xl';

  const dataTable = colourArray.reduce(tableReducer, [
    [
      <span key="Hex" className={`${classNames}`}>
        Hex
      </span>,
      <span key="HSL" className={`${classNames}`}>
        HSL
      </span>,
      <span key="RGB" className={`${classNames}`}>
        RGB
      </span>,
      <span key="Luminance" className={`${classNames}`}>
        Luminance
      </span>,
      <span key="Black" className={`${classNames}`}>
        Contrast Ratio Black
      </span>,
      <span key="White" className={`${classNames}`}>
        Contrast Ratio White
      </span>,
    ],
  ]);

  const flexBoxes = dataTable.map((x, i) => {
    const curr = x[0].key?.toString().split('-')[0] || '#000000';
    const style = i === 0 ? undefined : { backgroundColor: curr, color: autoTextColour.autoTextColourFromHex(curr) };

    const key = `${i}row`;
    return (
      <div key={key} style={style} className="flex w-full  grow flex-row gap-2 ">
        {x}
      </div>
    );
  });
  return flexBoxes;
}

export default function InfoTable() {
  const { colourSet } = useColourInputContext();
  if (colourSet.size === 0) return null;
  const lumSort = [...colourSet].reduce(sortByLuminance, []).flatMap((x) => x);

  const tableMarkDown = getTable(lumSort);
  return (
    <div className="relative flex w-full overflow-x-auto px-8">
      <div className="w-min-[100%] relative mx-auto flex min-w-max shrink-0 grow  flex-col gap-0 border border-neutral-400 p-4 text-center text-neutral-800 dark:text-neutral-50">
        {tableMarkDown}
      </div>
    </div>
  );
}
