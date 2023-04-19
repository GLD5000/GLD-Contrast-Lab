import { useState } from 'react';
import { ColourObj, useColourInputContext } from '../../../contexts/ColourInputProvider';
import ContrastSelector from './ContrastSelector';

function getColourModeString(colourObject: ColourObj, mode: string) {
  if (mode === 'Hex') return `Hex: ${colourObject.Hex.slice(1)}`;
  if (mode === 'HSL') {
    const hsl = colourObject.HSL;
    const [hue, sat, lum] = hsl.slice(4, hsl.length - 1).split(',');
    return `Hue: ${hue} Sat: ${sat} Lum: ${lum}`;
  }
  if (mode === 'RGB') {
    const rgb = colourObject.RGB;
    const [red, green, blue] = rgb.slice(4, rgb.length - 1).split(',');
    return `Red: ${red} Green: ${green} Blue: ${blue}`;
  }
  return '';
}

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
    if (colourMode === 'CR')
      dispatchColourInput({ type: 'CYCLE_PREVIOUS_COLOUR', payload: { tag: previousColour?.Hex || '' } });
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

  const colourModeString = getColourModeString(
    recentColour,
    colourMode === 'Hex' || colourMode === 'HSL' || colourMode === 'RGB' ? colourMode : colourSpace,
  );
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
          {colourModeString}
        </button>
      </div>
    </>
  );
}
