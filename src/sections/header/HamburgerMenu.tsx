import SvgButtonNew from '../../elements/SvgButtonNew';
import GitHubSvg from '../../icons/GitHub';
import GLDNegSvg from '../../icons/GLDNegSvg';
import LinkedInSvg from '../../icons/LinkedInSvg';
import MoonSvg from '../../icons/MoonSvg';
import SunSvg from '../../icons/SunSvg';
import ExternalLink from './ExternalLink';

function getDarkToggleIcon(isDark: boolean) {
  const wrapper = <div className=" aspect-square h-6">{isDark ? <SunSvg /> : <MoonSvg />} </div>;
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
      className={`relative ${!show && 'hidden'} sm:hidden ${
        show && 'flex'
      } h-16 flex-wrap items-center justify-center gap-6 py-2`}
    >
      <ExternalLink
        layoutClasses="text-center flex flex-col w-16"
        link="https://gld-portfolio.vercel.app/"
        content={[
          <GLDNegSvg key="svg" />,
          <p key="text" className="m-0 md:inline">
            Portfolio
          </p>,
        ]}
      />
      <ExternalLink
        layoutClasses="text-center flex flex-col w-16"
        link="https://www.linkedin.com/in/garethlouisdevlin/"
        content={[
          <LinkedInSvg key="svg" />,
          <p key="text" className="m-0 md:inline">
            LinkedIn
          </p>,
        ]}
      />
      <ExternalLink
        layoutClasses="text-center flex flex-col w-16"
        link="https://github.com/GLD5000"
        content={[
          <GitHubSvg key="svg" />,
          <p key="text" className="m-0 md:inline">
            GitHub
          </p>,
        ]}
      />

      <SvgButtonNew
        showTextIn
        clickFunction={toggleColourTheme}
        reverse={false}
        id="colour-theme-button"
        name="Dark Mode Button"
        className="rounded text-xs"
        buttonClasses="flex flex-col w-12 h-12 text-base xs:hidden text-txt-mid hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-mid-dk dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk self-start"
        textElement={<div className="text-base">{colourTheme ? 'Light' : 'Dark'}</div>}
        svg={getDarkToggleIcon(colourTheme)}
      />
    </nav>
  );
}
