import { Dispatch, MouseEvent, SetStateAction } from 'react';
import TabButton from './TabButton';

export default function InputTabs({ tab, setTab }: { tab: string; setTab: Dispatch<SetStateAction<string>> }) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const element = e.target as HTMLButtonElement;
    const { id } = element;
    document.body.scrollTop = 44; // For Safari
    const container = document.getElementById('page-container');
    if (container) container.scrollTop = 44;
    if (tab !== id) {
      setTab(id);
    }
  }

  return (
    <div className="sticky top-16 z-50 w-full bg-white pt-2 dark:bg-neutral-800">
      <div className="text:current  flex w-fit flex-row flex-wrap  gap-1 rounded-none text-base dark:bg-neutral-800">
        <TabButton
          name="About"
          id="help"
          key="help"
          text="Help"
          clickFunction={handleClick}
          className="   w-40 grow rounded-none bg-neutral-100 py-1 px-2 text-current  hover:transition active:bg-slate-300"
          inactiveClasses="     dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
          currentTab={tab}
          activeClasses=" shadow-current shadow-bottom dark:bg-neutral-800 bg-neutral-50 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
        />

        <TabButton
          name="Add Colours"
          id="add-colours"
          key="add-colours"
          text="Add"
          clickFunction={handleClick}
          className=" w-40 grow rounded-none bg-neutral-100 py-1 px-2 text-current  hover:transition active:bg-slate-300"
          inactiveClasses="  dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
          currentTab={tab}
          activeClasses=" shadow-current shadow-bottom dark:bg-neutral-800 bg-neutral-50 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
        />
        <TabButton
          name="Comparison Matrix"
          id="compare-matrix"
          key="compare-matrix"
          text="Compare"
          clickFunction={handleClick}
          className=" w-40 grow rounded-none bg-neutral-100 py-1 px-2 text-current  hover:transition active:bg-slate-300"
          inactiveClasses="  dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
          currentTab={tab}
          activeClasses=" shadow-current shadow-bottom dark:bg-neutral-800 bg-neutral-50 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
        />
        {/* <TabButton
        name="Colour Info"
        id="colour-info"
        key="colour-info"
        text="Colour Info"
        clickFunction={handleClick}
        className=" w-40 grow rounded-none bg-neutral-100 py-1 px-2 text-current  hover:transition active:bg-slate-300"
        inactiveClasses="  dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
        currentTab={tab}
        activeClasses=" shadow-current shadow-bottom dark:bg-neutral-800 bg-neutral-50 dark:hover:bg-white dark:hover:text-black hover:text-white hover:bg-neutral-900"
      /> */}
      </div>
    </div>
  );
}
