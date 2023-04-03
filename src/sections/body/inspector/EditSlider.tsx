import { MouseEvent, useEffect, useState } from 'react';
import { useColourInputContext } from '../../../contexts/ColourInputProvider';

let run = false;

export default function EditSlider() {
  const { recentColour, hslSlider, sliderType, dispatchColourInput } = useColourInputContext();
  const [sendValue, setSendValue] = useState(hslSlider);
  // console.log('run:', run);
  const darkClasses =
    'hover:transition focus:transition text-txt-main-dk bg-deco-dk hover:bg-txt-main-dk hover:text-bg-var-dk focus:bg-txt-main-dk focus:text-bg-var-dk';
  const lightClasses =
    'text-txt-main bg-deco hover:bg-txt-low hover:text-bg-var hover:transition focus:bg-txt-low focus:text-bg-var focus:transition';
  const [classes, setClasses] = useState('');
  const autoColour = recentColour?.Autocolour;
  useEffect(() => {
    let mounted = true;
    if (mounted && autoColour) {
      if (autoColour === 'Black') setClasses(lightClasses);
      if (autoColour === 'White') setClasses(darkClasses);
    }

    return () => {
      mounted = false;
    };
  }, [autoColour]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (run) {
        dispatchColourInput({ type: 'UPDATE_HSL', payload: { hslSlider: sendValue, sliderType } });
        run = false;
      }
    }, 30);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [sendValue, dispatchColourInput, sliderType]);

  function handleClickAdd() {
    dispatchColourInput({ type: 'SUBMIT', payload: { textInput: `` } });
  }

  function handleTypeClick() {
    const typeLookup: { [key: string]: string } = {
      Hue: 'Sat',
      Sat: 'Lum',
      Lum: 'Hue',
    };
    const newType = typeLookup[sliderType];
    dispatchColourInput({ type: 'SET_TYPE', payload: { textInput: newType } });
  }
  function handleSliderInput(e: MouseEvent<HTMLInputElement>) {
    const newValue = Number(e.currentTarget.value);
    // dispatchColourInput({ type: 'UPDATE_HSL', payload: { hslSlider: newValue, sliderType } });
    setSendValue(newValue);
    // console.log('input', newValue);
    run = true;
  }

  function handleClickRandom() {
    dispatchColourInput({ type: 'RANDOMISE', payload: {} });
  }

  return (
    <div className="mb-2 grid w-72 text-txt-main dark:text-txt-main-dk">
      <div className="flex h-12  flex-row flex-wrap content-center gap-2">
        <label htmlFor="hsl-slider">
          <div className="w-full rounded">
            <button className={`w-16 rounded  py-2 px-4 text-xs ${classes} `} type="button" onClick={handleTypeClick}>
              {sliderType}
            </button>
          </div>
        </label>
        <input
          id="hsl-slider"
          className="my-auto h-1 shrink-0 grow cursor-pointer appearance-none rounded bg-neutral-500 text-inherit hover:bg-current hover:transition focus:bg-current focus:transition"
          type="range"
          min={0}
          step={0.1}
          max={360}
          value={hslSlider}
          onInput={handleSliderInput}
        />
      </div>
      <div className="flex h-12 flex-row gap-1 py-1">
        <div className="w-full rounded">
          <button
            type="button"
            id="randomise-colour"
            className={`h-full w-full rounded py-2 px-4 text-xs ${classes} `}
            onClick={handleClickRandom}
          >
            <p className="m-auto text-sm">Cancel</p>
          </button>
        </div>

        <div className="w-full rounded">
          <button
            type="button"
            id="add-colour"
            className={`h-full w-full rounded py-2 px-4 text-xs ${classes} `}
            onClick={handleClickAdd}
          >
            <p className="m-auto text-sm">Submit</p>
          </button>
        </div>
      </div>
    </div>
  );
}
