import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import SvgButton from '../../elements/SvgButton';
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

function getButtons(csv: string, setDataColumns: Dispatch<SetStateAction<Set<string>>>) {
  const csvButton = <CsvButton key="csv-copy-btn" data={csv} />;
  function handleVisibilityClick() {
    setDataColumns(new Set());
  }
  const visibilityButton = (
    <SvgButton
      key="custom-visibility-btn"
      text="Customise..."
      clickFunction={handleVisibilityClick}
      id="custom-visibility-btn"
      name="Customise Data"
      className=" flex justify-center gap-2 text-sm hover:bg-black hover:text-white hover:transition active:bg-slate-600 hover:dark:bg-white hover:dark:text-black"
      type="preview"
      showText
      reverse={false}
      buttonClasses={undefined}
      svgWrapperClasses="w-6 h-6"
      svgClasses="stroke fill-none stroke-current self-center"
    />
  );
  return (
    <div key="table-bottom-btns" className="flex w-full flex-row gap-2  rounded-none">
      {visibilityButton} {csvButton}
    </div>
  );
}

function getTable(
  colourArray: string[],
  dataColumns: Set<string>,
  setDataColumns: Dispatch<SetStateAction<Set<string>>>,
) {
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
  const buttonArray = getButtons(csv, setDataColumns);
  flexBoxes.push(buttonArray);
  return flexBoxes;
}

function setInitialColumns(): Set<string> {
  const windowWidth = window.innerWidth;
  const windowKey = Math.min(6, Math.max(2, Math.floor(windowWidth / 200)));
  const dataColumnLookup: { [elemName: number]: string[] } = {
    2: ['Hex', 'Luminance'],
    3: ['Hex', 'Luminance', 'Black'],
    4: ['Hex', 'Luminance', 'Black', 'White'],
    5: ['Hex', 'HSL', 'Luminance', 'Black', 'White'],
    6: ['Hex', 'HSL', 'RGB', 'Luminance', 'Black', 'White'],
  };

  return new Set(dataColumnLookup[windowKey]);
}

export default function InfoTable() {
  const { colourSet } = useColourInputContext();
  const [dataColumns, setDataColumns] = useState(setInitialColumns());
  if (colourSet.size === 0 || dataColumns.size === 0) return null;
  function setColumnsOnResize() {
    setDataColumns(setInitialColumns());
  }
  window.onresize = setColumnsOnResize;
  const lumSort = [...colourSet].reduce(sortByLuminance, []).flatMap((x) => x);
  const tableMarkDown = dataColumns.size > 1 ? getTable(lumSort, dataColumns, setDataColumns) : null;
  return (
    <div className="relative w-full overflow-x-auto pb-4">
      <div className="relative mx-auto flex w-fit grow  flex-col gap-0 overflow-clip rounded border border-neutral-900 bg-white text-center text-neutral-800 dark:border-neutral-300 dark:bg-neutral-700 dark:text-neutral-50">
        {tableMarkDown}
      </div>
    </div>
  );
}
