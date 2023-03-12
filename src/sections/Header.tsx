import SvgButton from '../elements/SvgButton';
import GldSvg from '../icons/GldSvg';

export default function Header({
  toggleColourTheme,
  colourTheme,
}: {
  toggleColourTheme: () => void;
  colourTheme: boolean;
}) {
  return (
    <header className="sticky top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-shrink-0 flex-grow-0 grid-cols-frAutoFr content-center bg-neutral-100 dark:bg-neutral-800">
      <nav className=" col-start-2 flex w-body min-w-body max-w-body flex-wrap items-center justify-between  ">
        <div className="flex h-16 flex-wrap items-center gap-2 p-2">
          <a href="https://gld-portfolio.vercel.app/" target="_blank" rel="noreferrer">
            {' '}
            <GldSvg />
          </a>

          <div className="flex flex-row overflow-clip rounded-lg border-2 border-current">
            <h1 className=" rounded-none bg-white px-1 text-2xl font-black text-black">CONTRAST</h1>
            <h1 className="  rounded-none bg-black px-1 text-2xl font-black text-white">TOOL</h1>
          </div>
        </div>
        <div className="relative flex h-16 flex-wrap items-center justify-center gap-4 py-2">
          {/* <Button
            backgroundColor=""
            text={colourTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            clickFunction={toggleColourTheme}
            id="colour-theme-button"
            name="Dark Mode Button"
            className="rounded text-xs"
            activeClasses="dark:hover:bg-neutral-100 dark:hover:text-neutral-900 hover:text-neutral-50 hover:bg-neutral-800"
            conditionalClasses=""
          /> */}
          <SvgButton
            svgWrapperClasses="pointer-events-none h-6 w-6"
            text={colourTheme ? 'Light' : 'Dark'}
            clickFunction={toggleColourTheme}
            type={colourTheme ? 'sun' : 'moon'}
            showText
            reverse={false}
            id="colour-theme-button"
            name="Dark Mode Button"
            className="rounded text-xs"
            buttonClasses="w-fit h-fit flex flex-col overflow-hidden hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:transition py-1 px-2"
            svgClasses="stroke-current fill-current stroke-2 dark:hover:fill-none"
          />
        </div>
      </nav>
    </header>
  );
}
