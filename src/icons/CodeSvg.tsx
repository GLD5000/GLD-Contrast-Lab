export default function CodeSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="code-svg" role="img" aria-label="Code" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 6,4 2,8 6,12" className={classes} />
        <path d="m 10,4 4,4 -4,4" className={classes} />
      </svg>
    </div>
  );
}
