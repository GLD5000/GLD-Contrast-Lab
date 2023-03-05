import { Dispatch, SetStateAction } from 'react';
import Link from '../../elements/Link';
import SvgButton from '../../elements/SvgButton';

export default function Banner({ setShowBanner }: { setShowBanner: Dispatch<SetStateAction<boolean>> }) {
  function handleBannerClick() {
    setShowBanner((oldValue: boolean) => !oldValue);
  }

  return (
    <section className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-800">
      <div className=" flex w-body min-w-body max-w-body flex-row flex-wrap items-center justify-between rounded-none border-2  border-x-transparent border-y-pink-200 bg-neutral-600 text-white dark:border-y-blue-700  dark:bg-neutral-400 dark:text-neutral-900 ">
        <h2 className=" m-2 text-current">Hi There! This project is part of the GLD Portfolio...</h2>
        <Link
          content="See more projects"
          link="https://gld-portfolio.vercel.app/"
          className="m-4 block rounded border-2 border-transparent bg-pink-200 p-2 text-lg text-black hover:bg-white hover:transition dark:bg-blue-700 dark:text-white dark:hover:border-current"
        />

        <SvgButton
          text="Close"
          clickFunction={handleBannerClick}
          id="close-banner"
          name="close-banner"
          className=" grid whitespace-pre-wrap rounded border-2 border-solid hover:border-current hover:transition"
          type="delete"
          showText={false}
          reverse={false}
          buttonClasses=" relative aspect-square h-8 items-center rounded hover:transition border-transparent hover:border-current self-start text-current"
          svgClasses="stroke-current fill-none stroke-2 h-full w-full"
        />
      </div>
    </section>
  );
}
