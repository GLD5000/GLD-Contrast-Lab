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
    <header className="sticky top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-shrink-0 flex-grow-0 grid-cols-frAutoFr content-center border-b bg-bg dark:bg-bg-dk">
      <nav className=" col-start-2 flex w-body min-w-body max-w-body flex-wrap items-center justify-between  ">
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
        <div className="relative flex h-16 flex-wrap items-center justify-center gap-8 py-2">
          <a
            className=" hidden  flex-row gap-2 text-txt-mid hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-mid-dk dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk sm:flex"
            href="https://gld-portfolio.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Portfolio
          </a>
          <a
            className=" hidden  flex-row gap-2 text-txt-mid hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-mid-dk dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk sm:flex"
            href="https://github.com/GLD5000"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
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
