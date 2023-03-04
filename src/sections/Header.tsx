import Button from '../elements/Button';
import GldSvg from '../icons/GldSvg';

export default function Header({
  title,
  toggleColourTheme,
  colourTheme,
}: {
  title: string;
  toggleColourTheme: () => void;
  colourTheme: string;
}) {
  return (
    <header className="sticky top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-shrink-0 flex-grow-0 grid-cols-frAutoFr content-center bg-neutral-100 dark:bg-neutral-800">
      <nav className=" col-start-2 flex w-body min-w-body max-w-body flex-wrap items-center justify-between align-middle  ">
        <div className="flex h-16 flex-wrap items-center gap-4 p-2">
          <GldSvg />
          <h1>{title}</h1>
        </div>
        <div className="relative flex h-16 flex-wrap items-center justify-center gap-4 py-2">
          <Button
            backgroundColor=""
            text={colourTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            clickFunction={toggleColourTheme}
            id="colour-theme-button"
            name="Dark Mode Button"
            className="rounded text-xs"
            activeClasses="dark:hover:bg-neutral-100 dark:hover:text-neutral-900 hover:text-neutral-50 hover:bg-neutral-800"
            conditionalClasses=""
          />
        </div>
      </nav>
    </header>
  );
}
