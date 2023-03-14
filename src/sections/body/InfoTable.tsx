import { Dispatch, ReactElement, MouseEvent, SetStateAction, useState } from 'react';
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
    showData: boolean;
  },
  curr: string,
): {
  csv: string;
  jsx: ReactElement[][];
  dataColumns: Set<string>;
  showData: boolean;
} {
  const classNames = 'block w-40 p-4 text-xs rounded-none';
  const luminanceFloat = luminance.convertHexToLuminance(curr);

  const valuesObject: { [key: string]: string } = {
    Hex: curr,
    HSL: colourSpace.convertHexToHslString(curr),
    RGB: colourSpace.convertHextoRgbString(curr),
    Luminance: luminance.convertHexToLuminancePercent(curr),
    Black: `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`,
    White: `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`,
  };

  const newerRow = Object.values(valuesObject).reduce(titleRowReducer, '\r\n');
  acc.csv += newerRow;
  if (acc.showData) {
    const newJsxRow = [...acc.dataColumns].map((key) => (
      <span key={`${curr}-${key}`} className={`${classNames}`}>
        {valuesObject[key]}
      </span>
    ));
    acc.jsx.push(newJsxRow);
  }
  return acc;
}
function titleRowReducer(previousValue: string, currentValue: string, currentIndex: number, array: string[]) {
  const returnValue = previousValue + (currentIndex < array.length - 1 ? `${currentValue}\t` : `${currentValue}`);
  return returnValue;
}
function getButtons(csv: string, setShowData: Dispatch<SetStateAction<boolean>>) {
  const csvButton = <CsvButton key="csv-copy-btn" data={csv} />;
  function handleVisibilityClick() {
    setShowData((state) => !state);
  }
  const visibilityButton = (
    <SvgButton
      key="custom-visibility-btn"
      text="Customise..."
      clickFunction={handleVisibilityClick}
      id="custom-visibility-btn"
      name="Customise Data"
      className=" flex justify-center gap-2 text-sm  hover:bg-black hover:text-white hover:transition active:bg-slate-600 hover:dark:bg-white hover:dark:text-black"
      type="preview"
      showText
      reverse={false}
      buttonClasses={undefined}
      svgWrapperClasses="w-6 h-6"
      svgClasses="stroke fill-none stroke-current self-center"
    />
  );
  return (
    <div
      key="table-bottom-btns"
      className="flex w-full flex-row gap-2 rounded-none border border-transparent border-t-current"
    >
      {visibilityButton} {csvButton}
    </div>
  );
}
function getVisibiltyButtons(dataColumns: Set<string>, setDataColumns: Dispatch<SetStateAction<Set<string>>>) {
  const titles = ['Hex', 'HSL', 'RGB', 'Luminance', 'Black', 'White'];
  function handleVisibilityClick(e: MouseEvent<HTMLButtonElement>) {
    const name = e.currentTarget.id.split('-')[0];
    setDataColumns((currentState) => {
      const newState = new Set([...currentState]);
      if (newState.has(name) && newState.size > 2) {
        newState.delete(name);
        return newState;
      }
      newState.add(name);
      return newState;
    });
  }
  const buttons = titles.map((key) => (
    <SvgButton
      key={`${key}-custom-visibility-btn`}
      text={key}
      clickFunction={handleVisibilityClick}
      id={`${key}-custom-visibility-btn`}
      name={`${key} Visibility`}
      className=" flex justify-start gap-2 pl-16 text-sm hover:bg-black hover:text-white hover:transition active:bg-slate-600 hover:dark:bg-white hover:dark:text-black"
      type={dataColumns.has(key) ? 'preview' : 'delete'}
      showText
      reverse={false}
      buttonClasses={undefined}
      svgWrapperClasses="w-6 h-6"
      svgClasses="stroke fill-none stroke-current self-center"
    />
  ));
  return buttons;
}
function getTable(
  colourArray: string[],
  dataColumns: Set<string>,
  setDataColumns: Dispatch<SetStateAction<Set<string>>>,
  showData: boolean,
  setShowData: Dispatch<SetStateAction<boolean>>,
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
    showData,
  };
  const { csv, jsx } = colourArray.reduce(tableReducer, tableAccumulator);
  const flexBoxes = jsx.map((x, i) => {
    const curr = x[0].key?.toString().split('-')[0] || '#000000';
    const style = i === 0 ? undefined : { backgroundColor: curr, color: autoTextColour.autoTextColourFromHex(curr) };

    const key = `${i}row`;
    const border = i === 0 ? ' border-b-current' : undefined;
    return (
      <div
        key={key}
        style={style}
        className={`flex w-fit  grow flex-row gap-2 rounded-none border border-transparent ${!!border && border} `}
      >
        {x}
      </div>
    );
  });
  const buttonArray = getButtons(csv, setShowData);
  if (showData === false) {
    const visibilityButtonsArray = getVisibiltyButtons(dataColumns, setDataColumns);
    flexBoxes.push(...visibilityButtonsArray);
  }
  flexBoxes.push(buttonArray);
  return flexBoxes;
}
function setInitialColumns(): Set<string> {
  const windowWidth = window.innerWidth;
  const windowKey = Math.min(6, Math.max(2, Math.floor(windowWidth / 200)));
  const dataColumnLookup: { [key: number]: string[] } = {
    2: ['Hex', 'Luminance'],
    3: ['Hex', 'Luminance', 'Black'],
    4: ['Hex', 'Luminance', 'Black', 'White'],
    5: ['Hex', 'HSL', 'Luminance', 'Black', 'White'],
    6: ['Hex', 'HSL', 'RGB', 'Luminance', 'Black', 'White'],
  };

  return new Set(dataColumnLookup[windowKey]);
}

export default function InfoTable() {
  const { colourMap } = useColourInputContext();
  const [dataColumns, setDataColumns] = useState(setInitialColumns());
  const [showData, setShowData] = useState(true);
  if (!colourMap || colourMap.size === 0) return null;
  function setColumnsOnResize() {
    setDataColumns(setInitialColumns());
  }
  window.onresize = setColumnsOnResize;
  const keysArray = [...colourMap.keys()];
  const lumSort = keysArray.reduce(sortByLuminance, []).flatMap((x) => x);
  const tableMarkDown = getTable(lumSort, dataColumns, setDataColumns, showData, setShowData);
  return (
    <section className="grid gap-4">
      <div className="mr-auto grid place-items-start">
        <h2 className=" m-0 text-2xl font-bold">Colour Data</h2>
        <p className="mt-2 mb-8 text-lg">View and Export</p>
        <p className="m-0">
          See the Relative Luminance of each colour and find its Contrast Ratio against white or black.{' '}
        </p>
        <p className="m-0">
          Use &apos;customise&apos; to choose the data on screen or &apos;Copy All&apos; to export all data in a
          spreadsheet format (TSV - Tab Separated Values).
        </p>
      </div>
      <div className="relative grid w-full overflow-x-auto">
        <div className="mx-auto flex w-fit grow  flex-col gap-0 overflow-clip rounded border border-neutral-900 bg-white text-center text-neutral-800 dark:border-neutral-300 dark:bg-neutral-700 dark:text-neutral-50">
          {tableMarkDown}
        </div>
      </div>
    </section>
  );
}
