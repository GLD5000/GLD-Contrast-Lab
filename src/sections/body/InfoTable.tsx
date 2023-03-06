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
  const classNames = 'block w-36 p-4 text-xs rounded-none';
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
  const classNames = ' block w-36 p-2 text-sm rounded-none text-center my-auto';

  const dataTable = colourArray.reduce(tableReducer, [
    [
      <b key="Hex" className={`${classNames}`}>
        Hex
      </b>,
      <b key="HSL" className={`${classNames}`}>
        HSL
      </b>,
      <b key="RGB" className={`${classNames}`}>
        RGB
      </b>,
      <b key="Luminance" className={`${classNames}`}>
        Luminance
      </b>,
      <b key="Black" className={`${classNames}`}>
        Contrast Black
      </b>,
      <b key="White" className={`${classNames}`}>
        Contrast White
      </b>,
    ],
  ]);

  const flexBoxes = dataTable.map((x, i) => {
    const curr = x[0].key?.toString().split('-')[0] || '#000000';
    const style = i === 0 ? undefined : { backgroundColor: curr, color: autoTextColour.autoTextColourFromHex(curr) };

    const key = `${i}row`;
    return (
      <div key={key} style={style} className="flex w-fit  grow flex-row gap-2 rounded-none">
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
    <div className="relative m-2 w-full overflow-x-auto px-8 pb-4">
      <div className="relative mx-auto flex w-fit grow  flex-col gap-0 overflow-clip rounded border border-neutral-900 bg-white text-center text-neutral-800 dark:border-neutral-300 dark:bg-neutral-700 dark:text-neutral-50">
        {tableMarkDown}
      </div>
    </div>
  );
}
