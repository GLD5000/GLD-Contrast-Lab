import GldSvg from '../icons/GldSvg';
import Portfolio from './header/Portfolio';

export default function Header({ title }: { title: string }) {
  return (
    <>
      <Portfolio />
      <header className="sticky top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-grow-0 grid-cols-frAutoFr content-center bg-neutral-800">
        <nav className=" col-start-2 flex w-body min-w-body max-w-body flex-wrap items-center justify-between align-middle  ">
          <div className="flex h-16 flex-wrap items-center gap-4 p-2">
            <GldSvg />
            <h1>{title}</h1>
          </div>
          <div className="relative flex h-16 flex-wrap items-center justify-center gap-4 py-2" />
        </nav>
      </header>
    </>
  );
}
