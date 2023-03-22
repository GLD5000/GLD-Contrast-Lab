import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import ColourBlocks from './body/ColourBlocks';
import ComboBox from './body/ComboBox';
import InfoTable from './body/InfoTable';

export default function Body() {
  return (
    <ColourInputProvider>
      <main id="body-container" className=" grid w-screen  flex-grow pt-2  sm:justify-items-center  ">
        <section className="flex h-full w-body min-w-body max-w-body flex-col ">
          <div className=" w-body-sm min-w-body max-w-body grow sm:w-body">
            <div className="mx-auto grid w-screen max-w-body items-center self-center px-4 py-10 sm:w-full sm:px-8">
              <div className=" mx-auto mt-10 flex flex-row overflow-clip rounded-lg border-2 border-current ">
                <h1 className=" rounded-none bg-white pt-1 pl-1 pr-2 font-black leading-6 text-black sm:text-6xl">
                  CONTRAST
                </h1>
                <h1 className="  rounded-none bg-black pt-1 pl-2 pr-4 font-black leading-6 text-white sm:text-6xl">
                  TOOL
                </h1>
              </div>
              <b className="mx-auto mt-2 mb-20 text-center text-xl">Create Accessible Colour Combinations</b>

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
