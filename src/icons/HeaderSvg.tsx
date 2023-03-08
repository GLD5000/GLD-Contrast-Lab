export default function HeaderSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="header-svg" role="img" aria-label="Header" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 4,4 V 12" className={classes} />
        <path d="m 4,8 h 8" className={classes} />
        <path d="M 12,4 V 12" className={classes} />
      </svg>
    </div>
  );
}
