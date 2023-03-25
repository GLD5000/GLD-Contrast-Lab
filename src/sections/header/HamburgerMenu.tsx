import SvgButtonNew from '../../elements/SvgButtonNew';
import GitHubSvg from '../../icons/GitHub';
import GLDNegSvg from '../../icons/GLDNegSvg';
import LinkedInSvg from '../../icons/LinkedInSvg';
import MoonSvg from '../../icons/MoonSvg';
import SunSvg from '../../icons/SunSvg';

const className =
  '  flex-row gap-2 text-txt-mid hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-mid-dk dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk sm:flex';
// const className =
//   "   flex-row gap-2 text-txt-main-dk hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-main dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk sm:flex";
function getDarkToggleIcon(isDark: boolean) {
  const wrapper = <div className=" my-auto aspect-square h-6">{isDark ? <SunSvg /> : <MoonSvg />} </div>;
  return wrapper;
}

export default function HamburgerMenu({
  toggleColourTheme,
  colourTheme,
  show,
}: {
  toggleColourTheme: () => void;
  colourTheme: boolean;
  show: boolean;
}) {
  return (
    <nav
      className={`relative ${!show && 'hidden'} ${
        show && 'flex'
      } h-16 flex-wrap items-center justify-center gap-8 py-2`}
    >
      <a
        className="   flex-row gap-2 text-txt-mid hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-mid-dk dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk sm:flex"
        href="https://gld-portfolio.vercel.app/"
        target="_blank"
        rel="noreferrer"
      >
        <GLDNegSvg />
        <p className="m-0  md:inline">Portfolio</p>
      </a>

      <a className={className} href="https://www.linkedin.com/in/garethlouisdevlin/" target="_blank" rel="noreferrer">
        <LinkedInSvg />
        <p className="m-0  md:inline">LinkedIn</p>
      </a>
      <a className={className} href="https://github.com/GLD5000" target="_blank" rel="noreferrer">
        <GitHubSvg />
        <p className="m-0  md:inline">GitHub</p>
      </a>
      <div className="flex flex-wrap gap-1">
        <SvgButtonNew
          clickFunction={toggleColourTheme}
          reverse={false}
          id="colour-theme-button"
          name="Dark Mode Button"
          className="rounded text-xs"
          buttonClasses="w-fit h-12  flex-col xs:hidden  flex overflow- hover:transition hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black py-1 px-2"
          textElement={<span className="absolute bottom-[0.475rem]">{colourTheme ? 'Light' : 'Dark'}</span>}
          svg={getDarkToggleIcon(colourTheme)}
        />
      </div>
    </nav>
  );
}
