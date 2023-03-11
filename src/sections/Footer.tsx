import GitHubSvg from '../icons/GitHub';
import GldSvg from '../icons/GldSvg';

export default function Footer() {
  return (
    <footer id="footer" className=" flex flex-shrink-0 flex-grow-0 flex-col flex-wrap items-center gap-2 py-1 text-sm">
      <a
        className=" flex flex-row gap-2 underline decoration-current underline-offset-2"
        href="https://gld-portfolio.vercel.app/"
        target="_blank"
        rel="noreferrer"
      >
        <GldSvg wrapperClasses=" pointer-events-none h-7 w-7 fill-current" />
        Part of the GLD Portfolio
      </a>

      <a
        className=" flex  w-fit flex-row gap-2 underline decoration-current underline-offset-2"
        href="https://github.com/GLD5000"
        target="_blank"
        rel="noreferrer"
      >
        <GitHubSvg />
        GLD5000 on GitHub
      </a>
      <p className=" mb-0 w-fit">🄯 2023 Gareth L Devlin</p>
    </footer>
  );
}
