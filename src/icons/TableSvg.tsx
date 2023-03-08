export default function TableSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="table-svg" role="img" aria-label="Table" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 2,3 H 14 V 7 H 2 V 3 13 H 14 V 7" className={classes} />
      </svg>
    </div>
  );
}
