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

function useDebounce(value: number, time: number) {
  const [debounceValue, setDebounceValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, time]);

  return debounceValue;
}

export default function HslSlider({ handleClickAdd }: { handleClickAdd: () => void }) {
  const { recentColour, type, dispatchColourInput } = useColourInputContext();
  const [sliderValue, setSliderValue] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const debouncedValue = useDebounce(sliderValue, 50);
  useEffect(() => {
    let run = true;
    if (run && recentColour !== undefined) {
      setSliderValue(getSliderValueHslString(`${recentColour.HSL}`, type));
    }
    return () => {
      run = false;
    };
  }, [recentColour, type]);

  useEffect(() => {
    let run = true;
    if (run && hasFocus) {
      dispatchColourInput({ type: 'UPDATE_HSL', payload: { number: debouncedValue, type } });
    }
    return () => {
      run = false;
    };
  }, [debouncedValue, dispatchColourInput, hasFocus, type]);

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
    setSliderValue(parseFloat(e.currentTarget.value));
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
        {recentColour !== undefined ? (
          <input
            id="hsl-slider"
            className="my-auto h-1 shrink-0 grow cursor-pointer appearance-none rounded bg-neutral-500 text-black dark:text-white"
            type="range"
            min={0}
            max={360}
            value={sliderValue}
            onInput={handleSliderInput}
            onFocus={() => {
              setHasFocus(true);
            }}
            onBlur={() => {
              setHasFocus(false);
            }}
          />
        ) : (
          <input
            id="hsl-slider"
            disabled
            className="my-auto h-1 shrink-0 grow cursor-not-allowed appearance-none rounded bg-neutral-500 text-neutral-500"
            type="range"
            min={0}
            max={360}
            value={sliderValue}
            onInput={handleSliderInput}
          />
        )}
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
