import { useState } from 'react';
import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import InputTabs from '../elements/InputTabs';
import ColourBlocks from './body/ColourBlocks';
import ComboBox from './body/ComboBox';
import InfoTable from './body/InfoTable';
import Banner from './header/Banner';

function getTab(tab: string) {
  if (tab === 'add-colours') {
    return (
      <>
        <ComboBox />
        <ColourBlocksProvider>
          <InfoTable />
        </ColourBlocksProvider>
      </>
    );
  }
  if (tab === 'compare-matrix') {
    return (
      <ColourBlocksProvider>
        <ColourBlocks />
      </ColourBlocksProvider>
    );
  }
  // if (tab === 'colour-info') {
  //   return (
  //     <ColourBlocksProvider>
  //       <InfoTable />
  //     </ColourBlocksProvider>
  //   );
  // }

  return null;
}
export default function Body() {
  const [tab, setTab] = useState('add-colours');
  const [showBanner, setShowBanner] = useState(true);

  const returnSection = getTab(tab);
  return (
    <ColourInputProvider>
      <main id="body-container" className=" grid w-screen  flex-grow justify-items-center  pt-2  align-middle ">
        <section className="flex h-full w-body min-w-body max-w-body flex-col gap-8 bg-neutral-100 dark:bg-neutral-800 ">
          {showBanner && <Banner setShowBanner={setShowBanner} />}
          <InputTabs tab={tab} setTab={setTab} />
          {returnSection}
        </section>
      </main>
    </ColourInputProvider>
  );
}
