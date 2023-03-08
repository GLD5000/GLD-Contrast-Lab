export default function ItalicSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="italic-svg" role="img" aria-label="Italic" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="m 5,4 h 8" className={classes} />
        <path d="M 10,4 6,12" className={classes} />
        <path d="m 3,12 h 8" className={classes} />
      </svg>
    </div>
  );
}
