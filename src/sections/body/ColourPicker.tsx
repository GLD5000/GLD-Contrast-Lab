import { MouseEvent, useEffect, useState } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import HslSlider from './HslSlider';

export default function ColourPicker() {
  const [type, setType] = useState('lum');
  const { recentColour, colourSet, dispatchColourInput } = useColourInputContext();
  console.log('recentColour:', recentColour);
  const fallbackValue = '#ffddff';
  const [currentValue, setCurrentValue] = useState(() => {
    if (recentColour !== undefined) return recentColour.Hex;
    return colourSet.size > 1 ? [...colourSet].at(-1) || fallbackValue : fallbackValue;
  });

  useEffect(() => {
    let run = true;
    if (run && recentColour !== undefined) {
      setCurrentValue(recentColour.Hex);
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
  return (
    <div className="grid h-fit w-80 overflow-clip rounded border">
      <div className="relative mx-auto flex h-12 w-full content-center overflow-clip rounded-b-none" style={styles}>
        <label
          htmlFor="main-colour-picker"
          className="absolute top-4 m-auto h-fit w-full text-center text-sm font-bold"
          style={{ color: autoTextColourFromHex(currentValue) }}
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
      <HslSlider
        hexValue={currentValue}
        setHexValue={setCurrentValue}
        dispatchColourInput={dispatchColourInput}
        type={type}
        setType={setType}
      />
    </div>
  );
}
