import { ReactElement } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import { autoTextColour } from '../../utilities/colour/autoTextColour';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { contrast } from '../../utilities/colour/contrastRatio';
import { luminance } from '../../utilities/colour/luminance';
import CsvButton from './CsvButton';

function sortByLuminance(acc: Array<Array<string>>, curr: string) {
  const luminanceInteger = Math.round(1000 * luminance.convertHexToLuminance(curr));
  acc[luminanceInteger] = acc[luminanceInteger] === undefined ? [curr] : [...acc[luminanceInteger], curr];
  return acc;
}

function tableReducer(
  acc: {
    csv: string;
    jsx: ReactElement[][];
  },
  curr: string,
): {
  csv: string;
  jsx: ReactElement[][];
} {
  const classNames = 'block w-40 p-4 text-xs rounded-none';
  const luminanceFloat = luminance.convertHexToLuminance(curr);
  const HSLValue = colourSpace.convertHexToHslString(curr);
  const RGBValue = colourSpace.convertHextoRgbString(curr);
  const LuminanceValue = luminance.convertHexToLuminancePercent(curr);
  const ContrastRatioBlackValue = contrast.getContrastRatio2Dp([0, luminanceFloat]);
  const ContrastRatioWhiteValue = contrast.getContrastRatio2Dp([1, luminanceFloat]);

  const newCsvRow = `\r\n${curr}\t${HSLValue}\t${RGBValue}\t${LuminanceValue}\t${ContrastRatioBlackValue}\t${ContrastRatioWhiteValue}`;
  acc.csv += newCsvRow;
  const currJsx = (
    <span key={`${curr}-currP`} className={`${classNames}`}>
      {curr}
    </span>
  );
  const HSLJsx = (
    <span key={`${curr}-HSL`} className={`${classNames}`}>
      {HSLValue}
    </span>
  );
  const RGBJsx = (
    <span key={`${curr}-RGB`} className={`${classNames}`}>
      {RGBValue}
    </span>
  );
  const LuminanceJsx = (
    <span key={`${curr}-Luminance`} className={`${classNames}`}>
      {LuminanceValue}
    </span>
  );
  const ContrastRatioBlackJsx = (
    <span key={`${curr}-ContrastRatioBlack`} className={`${classNames}`}>
      {ContrastRatioBlackValue}
    </span>
  );
  const ContrastRatioWhiteJsx = (
    <span key={`${curr}-ContrastRatioWhite`} className={`${classNames}`}>
      {ContrastRatioWhiteValue}
    </span>
  );
  const newRow: Array<ReactElement> = [
    currJsx,
    HSLJsx,
    RGBJsx,
    LuminanceJsx,
    ContrastRatioBlackJsx,
    ContrastRatioWhiteJsx,
  ];
  acc.jsx.push(newRow);
  return acc;
}
function getTable(colourArray: string[]) {
  const classNames = ' block w-40 p-2 text-sm rounded-none text-center my-auto';
  const tableAccumulator = {
    csv: 'Hex\tHSL\tRGB\tLuminance\tBlack\tWhite',
    jsx: [
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
    ],
  };
  const { csv, jsx } = colourArray.reduce(tableReducer, tableAccumulator);
  const flexBoxes = jsx.map((x, i) => {
    const curr = x[0].key?.toString().split('-')[0] || '#000000';
    const style = i === 0 ? undefined : { backgroundColor: curr, color: autoTextColour.autoTextColourFromHex(curr) };

    const key = `${i}row`;
    return (
      <div key={key} style={style} className="flex w-fit  grow flex-row gap-2 rounded-none">
        {x}
      </div>
    );
  });
  flexBoxes.push(<CsvButton key="csv-copy-btn" data={csv} />);
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
