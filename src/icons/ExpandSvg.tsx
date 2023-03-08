export default function ExpandSvg({ classes = 'stroke-current fill-none' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="expand-svg" role="img" aria-label="Expand" height="100%" width="100%" viewBox="0 0 10 10">
        <path
          className={classes}
          d="M 1,1 L 5,5 L 9,1"
          style={{
            strokeWidth: '20%',
            strokeLinecap: 'round',
          }}
        />
      </svg>
    </div>
  );
}
