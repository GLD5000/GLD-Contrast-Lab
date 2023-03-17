import { MouseEvent, useState, useEffect } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import HslSlider from './HslSlider';

export default function ColourPicker() {
  const { recentColour, dispatchColourInput } = useColourInputContext();
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
    const newValue = e.currentTarget.value;
    setCurrentValue(newValue);
    dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: newValue } });
  }

  function handleClickAdd() {
    dispatchColourInput({ type: 'SUBMIT', payload: { textInput: `${currentValue}` } });
  }

  return (
    <div className="grid h-fit w-80 overflow-clip rounded border">
      <div
        className="relative mx-auto flex h-12 w-full content-center overflow-clip rounded-b-none focus-within:outline focus-within:outline-current"
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
          value={currentValue}
        />
      </div>
      <HslSlider handleClickAdd={handleClickAdd} />
    </div>
  );
}
