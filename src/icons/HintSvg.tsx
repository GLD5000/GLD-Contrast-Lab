export default function HintSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="add-svg" role="img" aria-label="Add" height="100%" width="100%" viewBox="0 0 16 16">
        <g id="g518" transform="translate(-0.5,-0.5)">
          <circle className={classes} id="path296" cx="8" cy="8" r="6.6" />
          <path className={classes} d="m 8,7 v 5" id="path352" />
          <circle className={`${classes} fill-current`} id="path354" cx="8" cy="4.5" r="1" />
        </g>
      </svg>
    </div>
  );
}
