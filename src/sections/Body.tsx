import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import ColourBlocks from './body/ColourBlocks';
import ComboBox from './body/ComboBox';
import HeroSection from './body/HeroSection';
import InfoTable from './body/InfoTable';
import Contents from './body/heroSection/Contents';

export default function Body() {
  return (
    <ColourInputProvider>
      <main id="main-content" className=" grid w-screen grow grid-cols-frAutoFr content-between">
        <div className="col-start-2 flex h-full w-body-sm min-w-body max-w-body flex-col sm:w-body ">
          <div className="col-start-2 mx-auto grid w-full shrink-0 grow grid-rows-autoFr items-center py-10 ">
            <HeroSection />
            <Contents />
            <div>
              <ComboBox />
              <ColourBlocksProvider>
                <ColourBlocks />
                <InfoTable />
              </ColourBlocksProvider>
            </div>
          </div>
        </div>
      </main>
    </ColourInputProvider>
  );
}
