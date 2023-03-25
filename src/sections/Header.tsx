import GldSvg from '../icons/GldSvg';
import NavBar from './header/NavBar';

export default function Header({
  toggleColourTheme,
  colourTheme,
}: {
  toggleColourTheme: () => void;
  colourTheme: boolean;
}) {
  return (
    <header className="sticky top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-shrink-0 flex-grow-0 grid-cols-frAutoFr content-center border-b bg-bg dark:bg-bg-dk">
      <div className=" col-start-2 flex w-body min-w-body max-w-body flex-wrap items-center justify-between  ">
        <div className="flex h-16 flex-wrap items-center gap-2 p-2">
          <a href="https://gld-portfolio.vercel.app/" target="_blank" rel="noreferrer">
            {' '}
            <GldSvg />
          </a>

          <div className="flex flex-row overflow-clip rounded-lg border-2 border-current">
            <h1
              className=" m-auto rounded-none bg-white
              p-[0.3rem] text-2xl font-black text-black"
            >
              CONTRAST
            </h1>
            <h1 className=" m-auto rounded-none bg-black p-[0.3rem] text-2xl font-black text-white">TOOL</h1>
          </div>
        </div>
        <NavBar toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} />
      </div>
    </header>
  );
}
