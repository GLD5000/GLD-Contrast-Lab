import { Dispatch, SetStateAction } from 'react';
import Link from '../../elements/Link';
import SvgButton from '../../elements/SvgButton';

export default function Banner({ setShowBanner }: { setShowBanner: Dispatch<SetStateAction<boolean>> }) {
  function handleBannerClick() {
    setShowBanner((oldValue: boolean) => !oldValue);
  }

  return (
    <section className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-800">
      <div className=" relative grid w-body min-w-body max-w-body content-center rounded-none bg-neutral-600 text-center  text-white dark:bg-neutral-400 dark:text-neutral-900 ">
        <h2 className=" mr-auto px-2 text-current">Hello! I am GLD, I make tools for developers!</h2>
        <Link
          content="See more projects"
          link="https://gld-portfolio.vercel.app/"
          className="mx-auto my-2  block rounded-lg border border-transparent bg-pink-200 p-3 text-lg text-black  hover:bg-white hover:transition dark:bg-blue-700 dark:text-white dark:hover:border-current"
        />

        <SvgButton
          svgWrapperClasses="pointer-events-none h-6 w-6"
          text="Close"
          clickFunction={handleBannerClick}
          id="close-banner"
          name="close-banner"
          className=" grid whitespace-pre-wrap rounded border border-solid hover:border-current hover:transition"
          type="delete"
          showText={false}
          reverse={false}
          buttonClasses=" absolute right-1 top-1 aspect-square h-8 items-center rounded hover:transition border-transparent hover:border-current self-start text-current"
          svgClasses="stroke-current fill-none stroke-2 h-full w-full"
        />
      </div>
    </section>
  );
}
