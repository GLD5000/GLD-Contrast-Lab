export default function AddSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className=" pointer-events-none h-6  w-6">
      <svg id="add-svg" role="img" aria-label="Add" height="100%" width="100%" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" className={classes} />
        <path d="M 4,8 h 8 M 8,4 v 8" className={classes} />
      </svg>
    </div>
  );
}
