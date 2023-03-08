import { ReactElement, useState } from 'react';
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
    dataColumns: Set<string>;
  },
  curr: string,
): {
  csv: string;
  jsx: ReactElement[][];
  dataColumns: Set<string>;
} {
  const classNames = 'block w-40 p-4 text-xs rounded-none';
  const luminanceFloat = luminance.convertHexToLuminance(curr);

  const valuesObject: { [elemName: string]: string } = {
    Hex: curr,
    HSL: colourSpace.convertHexToHslString(curr),
    RGB: colourSpace.convertHextoRgbString(curr),
    Luminance: luminance.convertHexToLuminancePercent(curr),
    Black: `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`,
    White: `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`,
  };

  const newerRow = Object.values(valuesObject).reduce(titleRowReducer, '\r\n');
  acc.csv += newerRow;

  const newJsxRow = [...acc.dataColumns].map((key) => (
    <span key={`${curr}-${key}`} className={`${classNames}`}>
      {valuesObject[key]}
    </span>
  ));
  const newRow: Array<ReactElement> = newJsxRow;
  acc.jsx.push(newRow);
  return acc;
}
function titleRowReducer(previousValue: string, currentValue: string, currentIndex: number, array: string[]) {
  const returnValue = previousValue + (currentIndex < array.length - 1 ? `${currentValue}\t` : `${currentValue}`);
  return returnValue;
}

function getTable(colourArray: string[], dataColumns: Set<string>) {
  const classNames = ' block w-40 p-2 text-sm rounded-none text-center my-auto';
  const jsxArray = [...dataColumns].map((key) => {
    const content = key === 'White' || key === 'Black' ? `Contrast ${key}` : key;
    return (
      <b key={key} id={`${key}-table`} className={`${classNames}`}>
        {content}
      </b>
    );
  });
  const tableAccumulator = {
    csv: 'Hex\tHSL\tRGB\tLuminance\tBlack\tWhite',
    jsx: [[...jsxArray]],
    dataColumns,
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
  const [dataColumns, setDataColumns] = useState(new Set(['Hex', 'Luminance']));
  console.log('setDataColumns:', setDataColumns);
  if (colourSet.size === 0) return null;
  const lumSort = [...colourSet].reduce(sortByLuminance, []).flatMap((x) => x);

  const tableMarkDown = getTable(lumSort, dataColumns);
  return (
    <div className="relative w-full overflow-x-auto pb-4">
      <div className="relative mx-auto flex w-fit grow  flex-col gap-0 overflow-clip rounded border border-neutral-900 bg-white text-center text-neutral-800 dark:border-neutral-300 dark:bg-neutral-700 dark:text-neutral-50">
        {tableMarkDown}
      </div>
    </div>
  );
}
