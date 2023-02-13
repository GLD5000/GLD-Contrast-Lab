import GldSvg from '../icons/GldSvg';

export default function Header({ title }: { title: string }) {
  return (
    <section className="flex w-screen flex-col">
      <h1 className=" self-center whitespace-pre bg-neutral-800">Hello, my name is Gareth AKA GLD5000! </h1>
      <h2 className="self-center whitespace-pre bg-neutral-800">
        This is one of my portfolio projects- to see more click here!
      </h2>

      <header className="sticky top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-grow-0 grid-cols-frAutoFr content-center bg-neutral-800">
        <nav className=" col-start-2 flex w-body min-w-body max-w-body flex-wrap items-center justify-between align-middle  ">
          <div className="flex h-16 flex-wrap items-center gap-4 p-2">
            <GldSvg />
            <h1>{title}</h1>
          </div>
          <div className="relative flex h-16 flex-wrap items-center justify-center gap-4 py-2" />
        </nav>
      </header>
    </section>
  );
}
