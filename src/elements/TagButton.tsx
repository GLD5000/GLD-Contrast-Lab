import { MouseEvent } from 'react';

export default function TagButton({
  color = 'white',
  backgroundColor = 'black',
  text = 'Add',
  clickFunction,
  id,
  name,
  className = 'btn',
}: {
  color: string;
  backgroundColor: string;
  text: string;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  id: string;
  name: string;
  className: string;
}) {
  function clickHandler(e: MouseEvent<HTMLButtonElement>) {
    clickFunction(e);
  }
  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickHandler}
      className={`border-2 py-1 px-2 hover:border-white active:bg-slate-600 ${className} hover:transition`}
      style={{ color, backgroundColor }}
    >
      {text}
    </button>
  );
}
