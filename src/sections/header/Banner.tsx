import { Dispatch, SetStateAction } from 'react';
import Link from '../../elements/Link';
import SvgButton from '../../elements/SvgButton';

export default function Banner({ setShowBanner }: { setShowBanner: Dispatch<SetStateAction<boolean>> }) {
  function handleBannerClick() {
    setShowBanner((oldValue: boolean) => !oldValue);
  }

  return (
    <section className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-800">
      <div className=" flex w-body min-w-body max-w-body flex-row flex-wrap items-center justify-between rounded-none border-4  border-x-transparent  border-y-pink-200 dark:border-y-pink-900 ">
        <h1 className=" m-6 text-current">Hi There! This project is part of the GLD Portfolio...</h1>
        <Link
          content="See my projects"
          link="https://gld-portfolio.vercel.app/"
          className="block rounded-full border-4 border-transparent bg-pink-200 p-4 text-2xl text-blue-200 hover:border-current  hover:transition dark:bg-pink-900"
        />

        <SvgButton
          color="text-current"
          backgroundColor={undefined}
          text="Close"
          clickFunction={handleBannerClick}
          id="close-banner"
          name="close-banner"
          className={undefined}
          activeClasses={undefined}
          type="delete"
          showText={false}
          reverse={false}
          buttonClasses="p2 items-center rounded hover:transition border-transparent hover:border-current self-start"
          svgClasses={undefined}
        />
      </div>
    </section>
  );
}
