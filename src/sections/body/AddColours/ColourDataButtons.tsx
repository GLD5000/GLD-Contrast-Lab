import { useState } from 'react';
import { useColourInputContext } from '../../../contexts/ColourInputProvider';
import ContrastSelector from './ContrastSelector';

export default function ColourDataButtons() {
  const { recentColour, previousColour, colourMode, dispatchColourInput } = useColourInputContext();
  const [colourSpace, setColourSpace] = useState('Hex');
  // const colourMapKeys = colourMap ? [...colourMap.keys()] : undefined;
  function changeColourSpace() {
    const colourSpaceLookup: { [key: string]: string } = {
      Hex: 'HSL',
      HSL: 'RGB',
      RGB: 'Hex',
    };
    const newSpace = colourSpaceLookup[colourSpace];
    changeColourMode(newSpace);
    setColourSpace(newSpace);
  }

  function changeColourMode(modeIn: string) {
    dispatchColourInput({ type: 'CHANGE_COLOUR_MODE', payload: { colourMode: modeIn } });
  }
  if (recentColour === undefined) return null;
  const { Luminance, Black, White, Name } = recentColour;

  function handleClickName() {
    changeColourMode('Name');
    document.getElementById('colour-input')?.focus();
  }

  function handleClickContrast() {
    if (colourMode !== 'CR') changeColourMode('CR');
  }
  function handleClickRLum() {
    changeColourMode('RLum');
    document.getElementById('colour-input')?.focus();
  }
  function handleClickColourspace() {
    if (colourMode !== 'RLum' && colourMode !== 'Name') changeColourSpace();
    if (colourMode === 'RLum' || colourMode === 'Name') changeColourMode(colourSpace);
    document.getElementById('colour-input')?.focus();
  }
  const contrastString = `Contrast ${previousColour?.Name ?? 'Black/White'}: ${
    previousColour?.contrast ?? `${Black}/${White}`
  }
 `;
  return (
    <>
      <ContrastSelector />
      <div className="absolute left-1 bottom-1 grid w-fit bg-transparent">
        <button
          className=" w-full text-left font-code text-xs  text-green-900 dark:text-green-300"
          type="button"
          id="name-button"
          key="name-button"
          onClick={handleClickName}
        >
          {`Name: ${Name || '-'}`}
        </button>
        <button
          className=" w-full text-left font-code text-xs  text-green-900 dark:text-green-300"
          type="button"
          id="contrast-button"
          key="contrast-button"
          onClick={handleClickContrast}
        >
          {contrastString}
        </button>
        <button
          className=" w-full text-left font-code text-xs  text-green-900 dark:text-green-300"
          type="button"
          id="rlum-button"
          key="rlum-button"
          onClick={handleClickRLum}
        >
          {`Relative Luminance: ${Luminance}`}
        </button>
        <button
          className=" w-full text-left font-code text-xs  text-green-900 dark:text-green-300"
          type="button"
          id="colourspace-button"
          key="colourspace-button"
          onClick={handleClickColourspace}
        >
          {colourMode === 'Hex' || colourMode === 'HSL' || colourMode === 'RGB'
            ? recentColour[colourMode]
            : recentColour[colourSpace]}
        </button>
      </div>
    </>
  );
}
