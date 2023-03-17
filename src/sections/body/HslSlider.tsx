import { MouseEvent, useState } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

function convertHslToSlider(value: number, type: string) {
  if (type !== 'Hue') return Math.round(value * 3.6);
  return Math.round(value);
}

function parseHslStringToArray(stringIn: string) {
  const arrayValue = stringIn
    .toLowerCase()
    .replaceAll(/[hsl( )%]/g, '')
    .split(',')
    .map((x) => parseInt(x, 10));
  return arrayValue;
}
function getSliderValueHslString(hslString: string, type: string) {
  const [Hue, Sat, Lum] = parseHslStringToArray(hslString);
  const valueLookup: { [key: string]: number } = {
    Hue,
    Sat,
    Lum,
  };
  const newValue = convertHslToSlider(valueLookup[type], type);
  return newValue;
}

function convertSliderToHsl(value: number, type: string) {
  if (type !== 'Hue') return Math.round(value / 3.6);
  return Math.round(value);
}

function stringifyHslArray(ArrayIn: number[]) {
  const [hue, sat, lum] = ArrayIn;
  const stringValue = `HSL(${hue}, ${sat}%, ${lum}%)`;
  return stringValue;
}

function getHslValueFromSlider(sliderValue: number, type: string, hslString: string) {
  const convertedSliderValue = convertSliderToHsl(sliderValue, type);
  const [Hue, Sat, Lum] = parseHslStringToArray(hslString);
  const hslLookUp: { [key: string]: number[] } = {
    Hue: [convertedSliderValue, Sat, Lum],
    Sat: [Hue, convertedSliderValue, Lum],
    Lum: [Hue, Sat, convertedSliderValue],
  };
  return stringifyHslArray(hslLookUp[type]);
}

export default function HslSlider({ handleClickAdd }: { handleClickAdd: () => void }) {
  const [type, setType] = useState('Lum');

  const { recentColour, dispatchColourInput } = useColourInputContext();
  const hslString = recentColour?.HSL === undefined ? 'hsl(0,0%,0%)' : `${recentColour?.HSL}`;
  function handleTypeClick() {
    const typeLookup: { [key: string]: string } = {
      Hue: 'Sat',
      Sat: 'Lum',
      Lum: 'Hue',
    };
    const newType = typeLookup[type];
    setType(newType);
  }
  function handleSliderInput(e: MouseEvent<HTMLInputElement>) {
    const sliderValue = parseInt(e.currentTarget.value, 10);
    const newText = getHslValueFromSlider(sliderValue, type, hslString);
    dispatchColourInput({ type: 'UPDATE_HSL', payload: { textInput: newText } });
  }

  function handleClickRandom() {
    dispatchColourInput({ type: 'RANDOMISE', payload: {} });
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
          value={getSliderValueHslString(hslString, type) || 0}
          onInput={handleSliderInput}
        />
      </div>
      <div className="flex h-12 flex-row gap-1 p-1">
        <button
          type="button"
          id="randomise-colour"
          className="mx-auto my-0 flex  w-full  content-center gap-4 rounded bg-neutral-300 p-2 text-sm hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
          onClick={handleClickRandom}
        >
          <b className="m-auto ">Randomise</b>
        </button>

        <button
          type="button"
          id="add-colour"
          className="mx-auto my-0 flex w-full  content-center gap-4 rounded bg-neutral-300 p-2 text-sm hover:bg-neutral-700 hover:text-white  hover:transition active:bg-slate-600 dark:bg-neutral-700 hover:dark:bg-white hover:dark:text-black"
          onClick={handleClickAdd}
        >
          <b className="m-auto ">Submit</b>
        </button>
      </div>
    </div>
  );
}
