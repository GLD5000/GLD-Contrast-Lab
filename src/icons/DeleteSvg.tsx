export default function DeleteSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full p-1">
      <svg id="add-svg" role="img" aria-label="Add Section" height="100%" width="100%" viewBox="0 0 16 16">
        <path
          d="M 2,2
      L 14,14 
      M 14,2
      L 2,14"
          className={classes}
        />
      </svg>
    </div>
  );
}
