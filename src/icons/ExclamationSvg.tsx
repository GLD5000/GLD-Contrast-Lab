export default function ExclamationSvg({ classes = 'stroke-current stroke-1' }: { classes?: string }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="tick-svg" role="img" aria-label="Toggle On" height="100%" width="100%" viewBox="0 0 16 16">
        <circle
          cx="8"
          cy="8"
          r="6.5"
          style={{
            strokeLinecap: 'round',
            fill: 'none',
          }}
          className={classes}
        />

        <circle
          cx="8"
          cy="11"
          r="0.7"
          style={{
            strokeLinecap: 'round',
            fill: 'none',
          }}
          className={classes}
        />

        <path
          d="M 8,4
          l 0,4.5 
         "
          style={{
            strokeLinecap: 'round',
            fill: 'none',
          }}
          className={classes}
        />
      </svg>
    </div>
  );
}
ExclamationSvg.defaultProps = {
  classes: 'stroke-current stroke-1',
};
