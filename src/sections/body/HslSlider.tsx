import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import { colourSpace } from '../../utilities/colour/colourSpace';

function convertHslToSlider(value: number, type: string) {
  if (type !== 'hue') return Math.round(value * 3.6);
  return Math.round(value);
}
function getSliderValueFromHex(hexString: string, type: string) {
  const [hue, sat, lum] = colourSpace.convertHexToHslArray(hexString);
  const valueLookup: { [key: string]: number } = {
    hue,
    sat,
    lum,
  };
  const newValue = convertHslToSlider(valueLookup[type], type);
  return newValue;
}

function convertSliderToHsl(value: number, type: string) {
  if (type !== 'hue') return Math.round(value / 3.6);
  return Math.round(value);
}

function getHexValueFromSlider(sliderValue: number, hexString: string, type: string) {
  const convertedSliderValue = convertSliderToHsl(sliderValue, type);
  const [hue, sat, lum] = colourSpace.convertHexToHslArray(hexString);
  const hslLookUp: { [key: string]: number[] } = {
    hue: [convertedSliderValue, sat, lum],
    sat: [hue, convertedSliderValue, lum],
    lum: [hue, sat, convertedSliderValue],
  };
  const newHexValue = colourSpace.convertHslArrayToHex(hslLookUp[type]);
  return newHexValue;
}

export default function HslSlider({
  hexValue,
  setHexValue,
  dispatchColourInput,
  type,
  setType,
}: {
  hexValue: string;
  setHexValue: Dispatch<SetStateAction<string>>;
  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string;
      recentColour: string;
      colourSet: Set<string>;
    }>;
  }>;
  type: string;
  setType: Dispatch<SetStateAction<string>>;
}) {
  const [currentValue, setCurrentValue] = useState(getSliderValueFromHex(hexValue, type));

  useEffect(() => {
    setCurrentValue(getSliderValueFromHex(hexValue, type));
  }, [hexValue, type]);

  function handleTypeClick() {
    const typeLookup: { [key: string]: string } = {
      hue: 'sat',
      sat: 'lum',
      lum: 'hue',
    };
    const newType = typeLookup[type];
    setType(newType);
    setCurrentValue(getSliderValueFromHex(hexValue, newType));
  }
  function handleSliderInput(e: MouseEvent<HTMLInputElement>) {
    const newValue = type === 'hex' ? parseInt(e.currentTarget.value, 10) : parseInt(e.currentTarget.value, 10);
    const newHex = getHexValueFromSlider(newValue, hexValue, type);
    setHexValue(newHex);
    setCurrentValue(newValue);
    dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: newHex } });
  }

  function handleClickAdd() {
    dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: `${hexValue}\t` } });
  }
  return (
    <div className="grid ">
      <div className="flex h-12 w-full flex-row flex-wrap content-center gap-2 px-2">
        <label htmlFor="hsl-slider">
          <button
            className="bg-neutral-300 py-2  px-4 text-xs hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
            type="button"
            onClick={handleTypeClick}
          >
            {type}
          </button>
        </label>
        <input
          id="hsl-slider"
          className="my-auto h-1 shrink-0 grow cursor-pointer appearance-none rounded bg-neutral-500 text-black dark:bg-gray-500 dark:text-white"
          type="range"
          min={0}
          max={360}
          value={currentValue}
          onInput={handleSliderInput}
        />
      </div>
      <button
        type="button"
        id="add-colour"
        className="mx-auto my-0 flex h-12 w-full  content-center gap-4 rounded-t-none bg-neutral-300 p-2 text-sm hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
        value={hexValue}
        onClick={handleClickAdd}
      >
        <b className="m-auto ">Submit</b>
      </button>
    </div>
  );
}
