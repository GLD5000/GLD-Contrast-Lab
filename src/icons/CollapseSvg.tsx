export default function CollapseSvg({ classes = 'stroke-current fill-none' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="collapse-svg" role="img" aria-label="Collapse" height="100%" width="100%" viewBox="0 0 10 10">
        <path
          className={classes}
          d="M 1,5 L 5,1 L 9,5"
          style={{
            strokeWidth: '20%',
            strokeLinecap: 'round',
          }}
        />
      </svg>
    </div>
  );
}
