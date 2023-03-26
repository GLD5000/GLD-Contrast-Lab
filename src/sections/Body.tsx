import ColourBlocksProvider from '../contexts/ColourBlocksProvider';
import ColourInputProvider from '../contexts/ColourInputProvider';
import ColourBlocks from './body/ColourBlocks';
import ComboBox from './body/ComboBox';
import InfoTable from './body/InfoTable';

export default function Body() {
  return (
    <ColourInputProvider>
      <main id="body-container" className=" grid w-screen grow grid-cols-frAutoFr content-between">
        <section className="col-start-2 flex h-full w-body-sm min-w-body max-w-body flex-col sm:w-body ">
          <div className="col-start-2 mx-auto grid w-full shrink-0 grow grid-rows-autoFr items-center py-10 ">
            <div className="mx-auto grid">
              <div className=" mx-auto mt-24 flex flex-row overflow-clip rounded-lg border-2 border-current ">
                <h1 className=" rounded-none bg-white p-3 font-black  leading-6 text-black sm:p-[0.95rem] sm:text-6xl">
                  CONTRAST
                </h1>
                <h1 className="  rounded-none bg-black p-3 font-black leading-6 text-white sm:p-[0.95rem] sm:text-6xl">
                  TOOL
                </h1>
              </div>
              <b className="mx-auto mt-2 mb-20 w-fit text-center text-xl">Create Accessible Colour Combinations</b>
            </div>
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
