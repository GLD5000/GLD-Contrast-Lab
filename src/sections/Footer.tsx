import GitHubSvg from '../icons/GitHub';
import GLDNegSvg from '../icons/GLDNegSvg';
import ExternalLink from './header/ExternalLink';

export default function Footer() {
  return (
    <footer id="footer" className=" flex flex-shrink-0 flex-grow-0 flex-col flex-wrap items-center gap-2 py-1 text-sm">
      <ExternalLink
        link="https://github.com/GLD5000"
        content={[
          <GLDNegSvg key="svg" />,
          <p key="text" className="m-0 ">
            Part of the GLD Portfolio
          </p>,
        ]}
      />

      <ExternalLink
        link="https://github.com/GLD5000"
        content={[
          <GitHubSvg key="svg" />,
          <p key="text" className="m-0 ">
            GLD5000 on GitHub
          </p>,
        ]}
      />

      <p className=" mb-0 w-fit text-txt-mid dark:text-txt-mid-dk">🄯 2023 Gareth L Devlin</p>
    </footer>
  );
}
