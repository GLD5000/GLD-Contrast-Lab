import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import ColourBlocks from './body/ColourBlocks';
import ComboBox from './body/ComboBox';
import InfoTable from './body/InfoTable';

export default function Body() {
  return (
    <ColourInputProvider>
      <main id="body-container" className=" grid w-screen  flex-grow justify-items-center  pt-2  ">
        <section className="flex h-full w-body min-w-body max-w-body flex-col ">
          <div className=" w-body min-w-body max-w-body grow bg-neutral-100 dark:bg-neutral-800">
            <ComboBox />
            <ColourBlocksProvider>
              <InfoTable />
              <ColourBlocks />
            </ColourBlocksProvider>
          </div>
        </section>
      </main>
    </ColourInputProvider>
  );
}
