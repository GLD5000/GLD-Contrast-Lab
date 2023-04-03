import { MouseEvent, useEffect, useState } from 'react';
import { useColourInputContext } from '../../../contexts/ColourInputProvider';

let run = false;

export default function EditSlider({ cancelHex, cancelEdit }: { cancelHex: string; cancelEdit: () => void }) {
  const { recentColour, hslSlider, sliderType, dispatchColourInput } = useColourInputContext();
  const [sendValue, setSendValue] = useState(hslSlider);
  // console.log('run:', run);
  const lightClasses =
    'hover:transition focus:transition text-txt-main-dk bg-deco-dk hover:bg-txt-main-dk hover:text-bg-var-dk focus:bg-txt-main-dk focus:text-bg-var-dk';
  const darkClasses =
    'text-txt-main bg-deco hover:bg-txt-low hover:text-bg-var hover:transition focus:bg-txt-low focus:text-bg-var focus:transition';
  const autoColour = recentColour?.Autocolour;

  const lightClassesSlider =
    'hover:transition focus:transition text-txt-mid bg-txt-low hover:bg-txt-main hover:text-txt-mid focus:bg-txt-main focus:text-txt-mid';
  const darkClassesSlider =
    'text-txt-main-dk bg-border-dk hover:bg-txt-low-dk hover:text-txt-main-dk hover:transition focus:bg-txt-low-dk focus:text-txt-main-dk focus:transition';

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
    dispatchColourInput({ type: 'SUBMIT_COMBO', payload: { textInput: `` } });
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

  function handleClickCancel() {
    dispatchColourInput({ type: 'ASSIGN_COMBO_COLOURS', payload: { tag: cancelHex } });
    cancelEdit();
  }

  return (
    <div className="mb-2 grid w-72 ">
      <div className="flex h-12  flex-row flex-wrap content-center gap-2">
        <label htmlFor="hsl-slider">
          <div className="w-full rounded">
            <button
              className={`w-16 rounded  py-2 px-4 text-xs ${autoColour === 'Black' ? lightClasses : darkClasses} `}
              type="button"
              onClick={handleTypeClick}
            >
              {sliderType}
            </button>
          </div>
        </label>
        <input
          id="hsl-slider"
          className={`my-auto h-1 shrink-0 grow cursor-pointer appearance-none rounded ${
            autoColour === 'Black' ? lightClassesSlider : darkClassesSlider
          }`}
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
            className={`h-full w-full rounded py-2 px-4 text-xs ${
              autoColour === 'Black' ? lightClasses : darkClasses
            } `}
            onClick={handleClickCancel}
          >
            <p className="m-auto text-sm">Cancel</p>
          </button>
        </div>

        <div className="w-full rounded">
          <button
            type="button"
            id="add-colour"
            className={`h-full w-full rounded py-2 px-4 text-xs ${
              autoColour === 'Black' ? lightClasses : darkClasses
            } `}
            onClick={handleClickAdd}
          >
            <p className="m-auto text-sm">Submit</p>
          </button>
        </div>
      </div>
    </div>
  );
}
