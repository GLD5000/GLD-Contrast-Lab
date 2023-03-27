import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import ColourBlocks from './body/ColourBlocks';
import ComboBox from './body/ComboBox';
import HeroSection from './body/HeroSection';
import InfoTable from './body/InfoTable';

export default function Body() {
  return (
    <ColourInputProvider>
      <main id="body-container" className=" grid w-screen grow grid-cols-frAutoFr content-between">
        <section className="col-start-2 flex h-full w-body-sm min-w-body max-w-body flex-col sm:w-body ">
          <div className="col-start-2 mx-auto grid w-full shrink-0 grow grid-rows-autoFr items-center py-10 ">
            <HeroSection />
            <div>
              <ComboBox />
              <ColourBlocksProvider>
                <ColourBlocks />
                <InfoTable />
              </ColourBlocksProvider>
            </div>
          </div>
        </section>
      </main>
    </ColourInputProvider>
  );
}
