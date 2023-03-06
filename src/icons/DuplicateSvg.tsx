export default function DuplicateSvg({ classes = 'stroke-1 fill-neutral-700 stroke-current' }) {
  return (
    <div className="pointer-events-none m-1 h-full w-full">
      <svg id="duplicate-svg" role="img" aria-label="copy" height="100%" width="100%" viewBox="0 0 16 16">
        <rect x="2" y="2" width="9" height="9" rx="1" className={classes} />
        <rect x="5" y="5" width="9" height="9" rx="1" className={classes} />
      </svg>
    </div>
  );
}
