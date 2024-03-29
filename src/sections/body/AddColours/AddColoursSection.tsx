import { FormEvent } from 'react';
import { useColourInputContext } from '../../../contexts/ColourInputProvider';

import ColourPicker from './ColourPicker';
import InlineList from './InlineList';
import ColourDataButtons from './ColourDataButtons';

// function getHexData(colourObject: ColourObj, colourMode: string, previousObject: PreviousColourObj | undefined) {
//   const { Hex, HSL, RGB, Luminance, Black, White, Name } = colourObject;
//   const colourSpaceLookup: { [key: string]: string } = {
//     Hex: `Relative Luminance: ${Luminance} \r\n${`${HSL}\r\n`}${`${RGB}\r\n`}`,
//     HSL: `Relative Luminance: ${Luminance} \r\n${`${Hex}\r\n`}${`${RGB}\r\n`}`,
//     RGB: `Relative Luminance: ${Luminance} \r\n${`${Hex}\r\n`}${`${HSL}\r\n`}`,
//     RLum: `${`${Hex}\r\n`}${`${HSL}\r\n`}${`${RGB}\r\n`}`,
//     Name: `Relative Luminance: ${Luminance} \r\n${`${Hex}\r\n`}${`${HSL}\r\n`}`,
//   };
//   return `Name: ${Name || '-'}\r\nContrast ${previousObject?.Name ?? 'Previous'}: ${
//     previousObject?.contrast ?? '-'
//   }\r\nContrast Black/White: ${Black}/${White}\r\n${colourSpaceLookup[colourMode]}`;
// }

export default function AddColoursSection() {
  const { textInput, recentColour, previousColour, colourMode, dispatchColourInput } = useColourInputContext();
  // const [hasFocus, setHasFocus] = useState(false);
  // console.log('recentColour:', recentColour);
  function handleClickMode() {
    const nextModeLookup: { [key: string]: string } = {
      Hex: 'HSL',
      HSL: 'RGB',
      RGB: 'RLum',
      RLum: 'CR',
      CR: 'Name',
      Name: 'Hex',

      // Luminance: string,
      // Black: string,
      // White: string,
    };
    dispatchColourInput({ type: 'CHANGE_COLOUR_MODE', payload: { colourMode: nextModeLookup[colourMode] } });
  }
  function handleClickClear() {
    dispatchColourInput({ type: 'CLEAR_TEXT', payload: {} });
    document.getElementById('colour-input')?.focus();
    // dispatchColourInput({ type: 'CLEAR_TEXT', payload: {} });
  }
  async function handleClickPaste() {
    const textPaste = await navigator.clipboard.readText();
    console.log(textPaste);
    if (textPaste) dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: textPaste } });
    console.log('window.navigator.userAgent:', window.navigator.userAgent);
  }

  function handleClickMatch() {
    // console.log('MATCH_LUMINANCE');
    if (recentColour?.Hex !== undefined) dispatchColourInput({ type: 'MATCH_LUMINANCE', payload: {} });
  }

  return (
    <>
      <section id="Add-Colours" className="m-0 flex scroll-my-24 flex-col gap-4">
        <div className="mr-auto grid place-items-start">
          <label htmlFor="colour-input m-0 p-0">
            <h2 className="m-0 p-0 text-2xl font-bold">Add</h2>
          </label>
          <p className="mt-2 mb-8 text-lg">Add, Edit and Delete</p>
          <ul className=" list-inside list-disc">
            <li key="input-list-a" id="input-list-a" className="m-0 mb-1">
              Use the colour picker and slider to choose and adjust colours.{' '}
            </li>
            <li key="input-list-b" id="input-list-b" className="m-0 mb-1">
              Batch add colours by pasting them into the text box.
            </li>
            <li key="input-list-c" id="input-list-c" className="m-0 mb-1">
              Edit your colours by clicking them and using the colour picker above.{' '}
            </li>
            <li key="input-list-d" id="input-list-d" className="m-0 mb-1">
              Use &apos;Delete All&apos; or &apos;X&apos; to delete colours.
            </li>
          </ul>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-2">
          <div className="relative flex min-h-[9rem] w-80 flex-col gap-1 rounded border bg-bg-var dark:bg-bg-var-dk">
            {colourMode !== 'CRB' && colourMode !== 'CRW' && colourMode !== 'CR' ? (
              <textarea
                rows={1}
                id="colour-input"
                placeholder="Enter colours here e.g.:    #fafafa   rgb(120, 120, 120)   hsl(200, 50%, 50%)  (submit with space or enter )"
                name="codeInput"
                className="shrink grow resize-none overflow-auto bg-bg-var px-2 pt-2 pb-1 text-base placeholder:text-txt-low dark:bg-bg-var-dk dark:placeholder:text-txt-low-dk"
                value={textInput}
                onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
                  const { value: targetValue } = e.currentTarget;
                  dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: targetValue } });
                }}
                onFocus={(e: FormEvent<HTMLTextAreaElement>): void => {
                  const element = e.currentTarget;
                  element.select();
                  // setHasFocus(true);
                }}
                // onBlur={() => {
                //   setHasFocus(false);
                // }}

                wrap="hard"
                autoComplete="off"
                autoCorrect="off"
              />
            ) : null}{' '}
            {colourMode !== 'CRB' &&
              colourMode !== 'CRW' &&
              colourMode !== 'CR' &&
              recentColour !== undefined &&
              textInput.length > 0 && (
                <button
                  id="clear-btn"
                  className="active:deco absolute right-1 top-1 w-16 bg-deco p-2  text-xs text-current  hover:bg-txt-low hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
                  type="button"
                  onClick={handleClickClear}
                >
                  Clear
                </button>
              )}
            {colourMode !== 'CR' &&
              previousColour !== undefined &&
              previousColour.contrast !== undefined &&
              previousColour.contrast !== 1 && (
                <button
                  id="match-btn"
                  className="active:deco absolute right-1 top-12 w-16 bg-deco p-2  text-xs text-current  hover:bg-txt-low hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
                  type="button"
                  onClick={handleClickMatch}
                >
                  Match
                </button>
              )}
            {recentColour !== undefined && textInput.length > 0 && <ColourDataButtons />}
            {recentColour !== undefined && textInput.length > 0 && (
              <button
                id="colourspace-btn"
                className="active:deco absolute right-1 bottom-1 w-16 bg-deco p-2  text-center text-xs text-current  hover:bg-txt-low hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
                type="button"
                onClick={handleClickMode}
              >
                {colourMode}
              </button>
            )}
            {recentColour === undefined && textInput.length === 0 && (
              <button
                id="colourspace-btn"
                className="active:deco absolute left-2 bottom-2 w-16 bg-deco p-2  text-center text-xs text-current  hover:bg-txt-low hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
                type="button"
                onClick={handleClickPaste}
              >
                Paste
              </button>
            )}
          </div>
          <ColourPicker />
        </div>
        <InlineList />
      </section>
      <hr className="my-8" />
    </>
  );
}
