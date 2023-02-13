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
  function getSvg(value: string): { [elemName: string]: ReactElement } {
    const svgLookup: { [elemName: string]: { [elemName: string]: ReactElement } } = {
      tick: { true: <TickSvg />, false: <UnTickSvg fill={backgroundColorIn} /> },
      flick: { true: <TickSvg />, false: <UnTickSvg fill={backgroundColorIn} /> },
    };
    const returnValue: { [elemName: string]: ReactElement } = svgLookup[value];
    return returnValue;
  }
  const svg: ReactElement = getSvg(style)[toggle];

  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickHandler}
      className="grid grid-cols-autoAuto items-center gap-2 border-2 border-zinc-600 px-2 py-1 transition delay-100 duration-200 ease-in-out hover:border-white"
      style={styles}
    >
      {showText && text}
      {svg}
    </button>
  );
}
