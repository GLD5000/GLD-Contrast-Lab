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
      <main id="main-content" className=" grid w-screen grow grid-cols-frAutoFr content-between">
        <div className="col-start-2 flex h-full w-body-sm min-w-body max-w-body flex-col sm:w-body ">
          <div className="col-start-2 mx-auto grid w-full shrink-0 grow grid-rows-autoFr items-center py-10 ">
            <HeroSection />
            <Contents />
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
