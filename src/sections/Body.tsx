import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import ColourBlocks from './body/ColourBlocks';
import ComboBox from './body/ComboBox';
import InfoTable from './body/InfoTable';
import InlineList from './body/InlineList';

export default function Body() {
  return (
    <ColourInputProvider>
      <main id="body-container" className=" grid w-screen  flex-grow justify-items-center  pt-2  ">
        <section className="flex h-full w-body min-w-body max-w-body flex-col ">
          <div className=" w-body min-w-body max-w-body grow bg-neutral-100 dark:bg-neutral-800">
            <div className="mx-auto grid w-full max-w-body items-center self-center px-4 py-10 sm:px-8">
              <div className=" mx-auto mt-10 flex flex-row overflow-clip rounded-lg border-2 border-current ">
                <h1 className=" rounded-none bg-white px-2  font-black text-black sm:text-6xl">CONTRAST</h1>{' '}
                <h1 className="  rounded-none bg-black px-2 font-black text-white sm:text-6xl">TOOL</h1>
              </div>
              <b className="mx-auto mt-2 mb-20 text-xl">Helping Developers Create Accessible Colour Combinations</b>

              <ComboBox />
              <InlineList />
              <ColourBlocksProvider>
                <InfoTable />
                <ColourBlocks />
              </ColourBlocksProvider>
            </div>
          </div>
        </section>
      </main>
    </ColourInputProvider>
  );
}
