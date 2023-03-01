import { MouseEvent } from 'react';

export default function TabButton({
  text = 'Add',
  clickFunction,
  id,
  name,
  className = 'w-full h-full rounded-none border-2 border-transparent py-1 px-2  hover:transition active:bg-slate-300',
  activeClasses = 'active:bg-slate-400',
  inactiveClasses,
  currentTab,
}: {
  text: string;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  id: string;
  name: string;
  className: string;
  activeClasses: string;
  inactiveClasses: string;
  currentTab: string;
}) {
  const active = currentTab === id;
  function clickHandler(e: MouseEvent<HTMLButtonElement>) {
    clickFunction(e);
  }
  const conditionalClasses = active ? activeClasses : inactiveClasses;
  return (
    <button type="button" id={id} name={name} onClick={clickHandler} className={`${className} ${conditionalClasses}`}>
      {text}
    </button>
  );
}
