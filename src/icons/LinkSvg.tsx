export default function LinkSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="link-svg" role="img" aria-label="Link" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 10,8 C 8,5 8,5 5,5 3,5 2,6 2,8 c 0,2 1,3 3,3" className={classes} />
        <path d="m 6,8 c 2,3 2,3 5,3 2,0 3,-1 3,-3 0,-2 -1,-3 -3,-3" className={classes} />
      </svg>
    </div>
  );
}
