import { useState } from 'react';
import GldSvg from '../icons/GldSvg';
import HamburgerMenu from './header/HamburgerMenu';
import NavBar from './header/NavBar';

export default function Header({
  toggleColourTheme,
  colourTheme,
}: {
  toggleColourTheme: () => void;
  colourTheme: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  function toggleShowMenu() {
    setShowMenu((state) => !state);
  }
  return (
    <header className="absolute top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-shrink-0 flex-grow-0 grid-cols-frAutoFr content-center border-b bg-bg dark:bg-bg-dk">
      <div className=" col-start-2 ">
        <div
          className=" flex w-body-sm min-w-body  max-w-body flex-wrap items-center justify-between
sm:w-body "
        >
          <a
            className="flex h-16 flex-wrap items-center gap-2 py-2"
            href="https://contrast-tool.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            <GldSvg />

            <div className="flex flex-row overflow-clip rounded-lg border-2 border-current">
              <h1
                className=" m-auto rounded-none bg-white
              p-[0.3rem] text-2xl font-black text-black"
              >
                CONTRAST
              </h1>
              <h1 className=" m-auto rounded-none bg-black p-[0.3rem] text-2xl font-black text-white">TOOL</h1>
            </div>
          </a>
          <NavBar toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} toggleMenu={toggleShowMenu} />
        </div>
        <HamburgerMenu toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} show={showMenu} />
      </div>
    </header>
  );
}
