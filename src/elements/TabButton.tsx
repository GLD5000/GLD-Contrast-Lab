import { MouseEvent } from 'react';

export default function TabButton({
  backgroundColor = undefined,
  text = 'Add',
  clickFunction,
  id,
  name,
  className = 'w-full h-full',
  activeClasses = 'active:bg-slate-400',
  conditionalClasses,
  currentTab,
}: {
  backgroundColor: string | undefined;
  text: string;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  id: string;
  name: string;
  className: string;
  activeClasses: string;
  conditionalClasses: string;
  currentTab: string;
}) {
  const active = currentTab === id;
  function clickHandler(e: MouseEvent<HTMLButtonElement>) {
    clickFunction(e);
  }
  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickHandler}
      className={`rounded-none border-2 border-transparent py-1 px-2  hover:transition active:bg-slate-300 ${activeClasses} ${className} ${
        backgroundColor && backgroundColor
      } ${active && conditionalClasses}`}
    >
      {text}
    </button>
  );
}
