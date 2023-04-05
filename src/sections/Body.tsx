import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import CompareColoursSection from './body/compareColours/CompareColoursSection';
import AddColoursSection from './body/AddColours/AddColoursSection';
import HeroSection from './body/hero/HeroSection';
import ExportDataSection from './body/exportData/ExportDataSection';
import Contents from './body/hero/Contents';

export default function Body() {
  return (
    <ColourInputProvider>
      <main id="main-content" className="relative grid w-screen grow grid-cols-frAutoFr content-between">
        <div id="contents-left" className=" sticky top-20 col-start-1 my-10 ml-auto mr-8 hidden h-fit w-fit xl:grid">
          <Contents />
        </div>
        <div className="col-start-2 flex h-full w-body-sm min-w-body max-w-body-sm flex-col sm:w-body 2xl:max-w-body ">
          <div className=" col-start-2 mx-auto grid w-full shrink-0 grow grid-rows-autoFr items-center py-10 ">
            <HeroSection />
            <div id="contents-mid" className=" top-20 col-start-1 mx-auto my-10 grid h-fit w-fit xl:hidden">
              <Contents />
            </div>

            <div>
              <AddColoursSection />
              <ColourBlocksProvider>
                <CompareColoursSection />
                <ExportDataSection />
              </ColourBlocksProvider>
            </div>
          </div>
        </div>
      </main>
    </ColourInputProvider>
  );
}
