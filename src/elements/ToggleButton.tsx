import { ReactElement, MouseEvent } from 'react';
import TickSvg from '../icons/TickSvg';
import UnTickSvg from '../icons/UnTickSvg';

const showText = true;
export default function ToggleButton({
  color: colourIn,
  backgroundColor: backgroundColorIn,
  text = 'Add',
  clickFunction,
  id,
  name,
  style = 'tick',
  toggle,
}: {
  color: string;
  backgroundColor: string;
  text: string;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  id: string;
  name: string;
  style: string;
  toggle: string;
}) {
  function clickHandler(e: MouseEvent<HTMLButtonElement>) {
    // return if wrong
    clickFunction(e);
  }
  const backgroundColor = toggle ? backgroundColorIn : '#b0b0b0';
  const color = toggle ? colourIn : '#000000';
  const styles = {
    backgroundColor,
    color,
  };
  function getSvg(value: string): { [key: string]: ReactElement } {
    const svgLookup: { [key: string]: { [key: string]: ReactElement } } = {
      tick: { true: <TickSvg classes="" />, false: <UnTickSvg fill={backgroundColorIn} /> },
      flick: { true: <TickSvg classes="" />, false: <UnTickSvg fill={backgroundColorIn} /> },
    };
    const returnValue: { [key: string]: ReactElement } = svgLookup[value];
    return returnValue;
  }
  const svg: ReactElement = getSvg(style)[toggle];

  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickHandler}
      className="grid grid-cols-autoAuto items-center gap-2 border-2 border-zinc-600 px-2 py-1 hover:border-white hover:transition"
      style={styles}
    >
      {showText && text}
      {svg}
    </button>
  );
}
