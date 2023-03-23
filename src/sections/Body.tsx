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
                <h1 className=" rounded-none bg-white p-3 font-black  leading-6 text-black sm:p-4 sm:text-6xl">
                  CONTRAST
                </h1>
                <h1 className="  rounded-none bg-black p-3 font-black leading-6 text-white sm:p-4 sm:text-6xl">TOOL</h1>
                {/* sm:pt-1 sm:pl-2 sm:pr-4 */}
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
