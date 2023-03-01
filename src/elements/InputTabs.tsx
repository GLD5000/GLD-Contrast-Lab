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
    <div className="text:current sticky top-16 z-50 grid w-full grid-cols-4 gap-1 rounded-none pb-2 text-lg dark:bg-neutral-800">
      <TabButton
        name="About"
        id="help"
        key="help"
        text="About"
        clickFunction={handleClick}
        className="bg-neutral-100 text-current hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-700"
        conditionalClasses="border-b-current dark:bg-neutral-800 bg-neutral-50"
        currentTab={tab}
        backgroundColor={undefined}
        activeClasses=""
      />

      <TabButton
        name="Add Colours"
        id="add-colours"
        key="add-colours"
        text="Add Colours"
        clickFunction={handleClick}
        className="bg-neutral-100 text-current hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-700"
        conditionalClasses="border-b-current dark:bg-neutral-800 bg-neutral-50"
        currentTab={tab}
        backgroundColor={undefined}
        activeClasses=""
      />
      <TabButton
        name="Comparison Matrix"
        id="compare-matrix"
        key="compare-matrix"
        text="Comparison Matrix"
        clickFunction={handleClick}
        className="bg-neutral-100 text-current hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-700"
        conditionalClasses="border-b-current dark:bg-neutral-800 bg-neutral-50"
        currentTab={tab}
        backgroundColor={undefined}
        activeClasses=""
      />
      <TabButton
        name="Colour Info"
        id="colour-info"
        key="colour-info"
        text="Colour Info"
        clickFunction={handleClick}
        className="bg-neutral-100 text-current hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-700"
        conditionalClasses="border-b-current  dark:bg-neutral-800 bg-neutral-50"
        currentTab={tab}
        backgroundColor={undefined}
        activeClasses=""
      />
    </div>
  );
}
