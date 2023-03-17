import { MouseEvent, useEffect, useState } from 'react';
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

function useDebounce(value: number, time: number, type: string, hslString: string) {
  const [debounceValue, setDebounceValue] = useState({ textInput: '', mode: '' });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue({ textInput: getHslValueFromSlider(value, type, hslString), mode: type });
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, time, type, hslString]);

  return debounceValue;
}

export default function HslSlider({ handleClickAdd }: { handleClickAdd: () => void }) {
  const { recentColour, type, dispatchColourInput } = useColourInputContext();

  const hslString = recentColour?.HSL === undefined ? 'hsl(0,0%,0%)' : `${recentColour?.HSL}`;
  const [sliderValue, setSliderValue] = useState(getSliderValueHslString(hslString, type) || 0);
  const debouncedValue = useDebounce(sliderValue, 50, type, hslString);

  useEffect(() => {
    let run = true;
    if (run) {
      setSliderValue(getSliderValueHslString(hslString, type));
    }
    return () => {
      run = false;
    };
  }, [hslString, type]);

  useEffect(() => {
    let run = true;
    if (run) {
      dispatchColourInput({ type: 'UPDATE_HSL', payload: debouncedValue });
    }
    return () => {
      run = false;
    };
  }, [debouncedValue, dispatchColourInput]);

  function handleTypeClick() {
    const typeLookup: { [key: string]: string } = {
      Hue: 'Sat',
      Sat: 'Lum',
      Lum: 'Hue',
    };
    const newType = typeLookup[type];
    dispatchColourInput({ type: 'SET_TYPE', payload: { textInput: newType } });
  }
  function handleSliderInput(e: MouseEvent<HTMLInputElement>) {
    // const sliderValue = parseInt(e.currentTarget.value, 10);

    // const newText = getHslValueFromSlider(sliderValue, type, hslString);
    // dispatchColourInput({ type: 'UPDATE_HSL', payload: { textInput: newText } });

    setSliderValue(parseInt(e.currentTarget.value, 10));
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
          value={sliderValue}
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
