import { Dispatch, ReactElement, MouseEvent, SetStateAction, useState } from 'react';
import { useColourInputContext, ColourMap } from '../../../contexts/ColourInputProvider';
import SvgButton from '../../../elements/SvgButton';
import TextUl from '../../../elements/TextUl';
import { autoTextColour } from '../../../utilities/colour/autoTextColour';
import { luminance } from '../../../utilities/colour/luminance';
import CsvButton from './CsvButton';
import NoData from '../NoData';

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
    showData: string;
    colourMap: ColourMap | undefined;
  },
  curr: string,
): {
  csv: string;
  jsx: ReactElement[][];
  dataColumns: Set<string>;
  showData: string;
  colourMap: ColourMap | undefined;
} {
  const classNames = 'block w-40 p-4 text-xs rounded-none';
  const currentObject = acc.colourMap?.get(curr);
  if (currentObject === undefined) return acc;
  const { Hex, HSL, RGB, Luminance, Black, White, Name } = currentObject;
  const valuesObject: { [key: string]: string } = {
    Name: `${Name}`,
    Hex: `${Hex}`,
    HSL: `${HSL}`,
    RGB: `${RGB}`,
    Luminance: `${Luminance}`,
    Black: `${Black}`,
    White: `${White}`,
  };
  const newerRow = Object.values(valuesObject).reduce(titleRowReducer, '\r\n');
  acc.csv += newerRow;
  if (acc.showData === 'data') {
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

function getCopyButtons(csv: string, colourMapIn: ColourMap | undefined) {
  if (!colourMapIn) return [];
  let css = '';
  let scss = '';
  let sass = '';
  let tailwind = '';
  colourMapIn.forEach((colour) => {
    const nameNoHash = colour.Name.replace('#', 'hex').toLowerCase();
    const hex = colour.Hex;
    css += `--${nameNoHash}: ${hex};\r\n`;
    scss += `$${nameNoHash}: ${hex};\r\n`;
    sass += `$${nameNoHash}: ${hex}\r\n`;
    tailwind += `'${nameNoHash}': '${hex}',\r\n`;
  });

  const twButton = (
    <CsvButton customClasses="py-4" key="tw-copy-btn" data={tailwind} messageIn="Tailwind Custom Colours" />
  );
  const cssButton = <CsvButton customClasses="py-4" key="css-copy-btn" data={css} messageIn="CSS Custom Properties" />;
  const scssButton = (
    <CsvButton customClasses="py-4" key="scss-copy-btn" data={scss} messageIn="SCSS Property Declarations" />
  );
  const sassButton = (
    <CsvButton customClasses="py-4" key="sass-copy-btn" data={sass} messageIn="Sass Property Declarations" />
  );
  const csvButton = (
    <CsvButton customClasses="py-4" key="csv-copy-btn" data={csv} messageIn="TSV (Tab Separated Values) All Data" />
  );
  return [twButton, cssButton, scssButton, sassButton, csvButton];
}
function getBottomButtons(setShowData: Dispatch<SetStateAction<string>>) {
  function handleCopyButtonClick() {
    setShowData((state) => {
      if (state !== 'copy') return 'copy';
      return 'data';
    });
  }
  const copyButton = (
    <SvgButton
      key="copy-data-btn"
      text="Copy..."
      clickFunction={handleCopyButtonClick}
      id="copy-data-btn"
      name="Copy Data"
      className=" flex h-9 justify-center gap-2 text-sm hover:bg-black hover:text-white hover:transition focus:text-white focus:transition hover:dark:bg-white hover:dark:text-black focus:dark:bg-white focus:dark:text-black"
      type="duplicate"
      showText
      reverse={false}
      buttonClasses={undefined}
      svgWrapperClasses="w-6 h-6"
      svgClasses="stroke fill-none stroke-current self-center"
    />
  );
  function handleVisibilityClick() {
    setShowData((state) => {
      if (state !== 'vis') return 'vis';
      return 'data';
    });
  }
  const visibilityButton = (
    <SvgButton
      key="custom-visibility-btn"
      text="View..."
      clickFunction={handleVisibilityClick}
      id="custom-visibility-btn"
      name="View Data"
      className=" flex h-9 justify-center gap-2 rounded-none text-sm hover:bg-black hover:text-white hover:transition focus:text-white focus:transition hover:dark:bg-white hover:dark:text-black focus:dark:bg-white focus:dark:text-black"
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
      className="flex h-9 w-full shrink-0 flex-row rounded-none border border-transparent border-t-inherit"
    >
      {visibilityButton} {copyButton}
    </div>
  );
}
function getVisibiltyButtons(dataColumns: Set<string>, setDataColumns: Dispatch<SetStateAction<Set<string>>>) {
  const titles = ['Name', 'Hex', 'HSL', 'RGB', 'Luminance', 'Black', 'White'];
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
      className=" flex justify-center gap-2 py-4 pl-16 text-sm hover:bg-black hover:text-white hover:transition focus:text-white focus:transition hover:dark:bg-white hover:dark:text-black focus:dark:bg-white focus:dark:text-black"
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
  showData: string,
  setShowData: Dispatch<SetStateAction<string>>,
  colourMap: ColourMap | undefined,
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
    csv: 'Name\tHex\tHSL\tRGB\tLuminance\tBlack\tWhite',
    jsx: [[...jsxArray]],
    dataColumns,
    showData,
    colourMap,
  };
  const { csv, jsx } = colourArray.reduce(tableReducer, tableAccumulator);
  const flexBoxes = jsx.map((x, i) => {
    const curr = x[0].key?.toString().split('-')[0] || '#000000';
    const style = i === 0 ? undefined : { backgroundColor: curr, color: autoTextColour.autoTextColourFromHex(curr) };

    const key = `${i}row`;
    const border = i === 0 ? ' border-b-inherit' : undefined;
    return (
      <div
        key={key}
        style={style}
        className={`flex w-fit flex-row gap-2 rounded-none border border-transparent ${!!border && border} `}
      >
        {x}
      </div>
    );
  });
  const buttonArray = getBottomButtons(setShowData);
  if (showData === 'vis') {
    const visibilityButtonsArray = getVisibiltyButtons(dataColumns, setDataColumns);
    flexBoxes.push(...visibilityButtonsArray);
  }
  if (showData === 'copy') {
    const copyButtonsArray = getCopyButtons(csv, colourMap);
    flexBoxes.push(...copyButtonsArray);
  }

  flexBoxes.push(buttonArray);
  return flexBoxes;
}
function setInitialColumns(): Set<string> {
  const sectionWidth = document.getElementById('Export-Data')?.clientWidth;
  const windowKey = sectionWidth !== undefined ? Math.min(7, Math.max(2, Math.floor(sectionWidth / 200))) : 2;
  const dataColumnLookup: { [key: number]: string[] } = {
    2: ['Name', 'Luminance'],
    3: ['Name', 'Luminance', 'Black'],
    4: ['Name', 'Luminance', 'Black', 'White'],
    5: ['Name', 'HSL', 'Luminance', 'Black', 'White'],
    6: ['Name', 'HSL', 'RGB', 'Luminance', 'Black', 'White'],
    7: ['Name', 'Hex', 'HSL', 'RGB', 'Luminance', 'Black', 'White'],
  };

  return new Set(dataColumnLookup[windowKey]);
}

const listStrings = [
  'See the Relative Luminance of each colour and find its Contrast Ratio against white or black.',
  `Use 'View...' to choose the data on screen or 'Copy...' to export to a text editor or spreadsheet.`,
];

export default function ExportDataSection() {
  const { colourMap } = useColourInputContext();
  const [dataColumns, setDataColumns] = useState(setInitialColumns());
  const [showData, setShowData] = useState('data');
  function setColumnsOnResize() {
    setDataColumns(setInitialColumns());
  }
  window.onresize = setColumnsOnResize;
  const keysArray = colourMap ? [...colourMap.keys()] : [];
  const lumSort = keysArray.reduce(sortByLuminance, []).flatMap((x) => x);
  const tableMarkDown = getTable(lumSort, dataColumns, setDataColumns, showData, setShowData, colourMap);
  return (
    <section id="Export-Data" className="grid min-h-[75vh] scroll-my-24 gap-4">
      <div className="mr-auto grid place-items-start">
        <h2 className=" m-0 text-2xl font-bold">Export Data</h2>
        <p className="mt-2 mb-8 text-lg">View and Export</p>
        <TextUl textArray={listStrings} />
      </div>
      {!colourMap || colourMap.size === 0 ? (
        <NoData />
      ) : (
        <div className="relative grid w-full overflow-x-auto">
          <div className="mx-auto flex h-fit w-fit flex-col gap-0 overflow-clip rounded border border-border bg-bg text-center text-txt-main dark:border-border-dk  dark:bg-bg-var-dk dark:text-txt-main-dk">
            {tableMarkDown}
          </div>
        </div>
      )}
    </section>
  );
}
