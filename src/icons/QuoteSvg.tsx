export default function QuoteSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="quote-svg" role="img" aria-label="Quote" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 4,10 C 6,10 6,9 6,5 H 4 v 2 h 2" className={classes} />
        <path d="m 10,10 c 2,0 2,-1 2,-5 h -2 v 2 h 2" className={classes} />
      </svg>
    </div>
  );
}
