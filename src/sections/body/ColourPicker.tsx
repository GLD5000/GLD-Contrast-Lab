import { MouseEvent, useEffect, useState } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import HslSlider from './HslSlider';

export default function ColourPicker() {
  const [type, setType] = useState('lum');

  const { recentColour, dispatchColourInput } = useColourInputContext();
  const [currentValue, setCurrentValue] = useState(() => {
    if (recentColour.length === 7) return recentColour;
    return '#000000';
  });

  useEffect(() => {
    let run = true;
    if (run && recentColour.length === 7) {
      setCurrentValue(recentColour);
    }

    return () => {
      run = false;
    };
  }, [recentColour]);

  console.log('recentColour:', recentColour);
  const styles = { backgroundColor: currentValue };
  function handleInput(e: MouseEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    setCurrentValue(newValue);
    dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: newValue } });
  }
  return (
    <div className="grid h-fit w-80 overflow-clip rounded border">
      <div className="mx-auto flex h-12 w-full overflow-clip rounded-b-none" style={styles}>
        <input className="h-full w-full grow" type="color" onInput={handleInput} value={currentValue} />
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
