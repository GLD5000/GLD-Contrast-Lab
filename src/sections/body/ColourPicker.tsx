import { MouseEvent, useState, useEffect } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import HslSlider from './HslSlider';

export default function ColourPicker() {
  const { recentColour, dispatchColourInput } = useColourInputContext();
  const [hasFocus, setHasFocus] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    recentColour && recentColour?.Hex ? `${recentColour?.Hex}` : '#000000',
  );
  useEffect(() => {
    let run = true;
    if (run) {
      setCurrentValue(recentColour && recentColour?.Hex ? `${recentColour?.Hex}` : '#000000');
    }
    return () => {
      run = false;
    };
  }, [recentColour]);

  const styles = { backgroundColor: currentValue };
  function handleInput(e: MouseEvent<HTMLInputElement>) {
    if (hasFocus) {
      const newValue = e.currentTarget.value;
      // console.log(newValue);
      setCurrentValue(newValue);
      dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: newValue } });
    }
  }

  return (
    <div className="grid h-fit w-80 overflow-clip rounded border">
      <div
        className="relative mx-auto flex h-12 w-full content-center overflow-clip rounded-b-none focus-within:outline focus-within:outline-offset-2 focus-within:outline-current focus-within:transition hover:outline hover:outline-offset-2 hover:outline-current hover:transition"
        style={styles}
      >
        <label
          htmlFor="main-colour-picker"
          className="absolute top-4 m-auto h-fit w-full text-center text-sm font-bold"
          style={{ color: autoTextColourFromHex(currentValue || '#ffffff') }}
        >
          Pick Colour
        </label>

        <input
          id="main-colour-picker"
          className="h-full w-full grow"
          type="color"
          onInput={handleInput}
          onFocus={() => {
            setHasFocus(true);
          }}
          onBlur={() => {
            setHasFocus(false);
          }}
          value={currentValue}
        />
      </div>
      <HslSlider />
    </div>
  );
}
