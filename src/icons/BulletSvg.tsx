export default function BulletSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg id="bullet-svg" role="img" aria-label="Bullet" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 4,3 h -2 v 2 h 2 z" className={classes} />
        <path d="M 8,4 h 6" className={classes} />
        <path d="M 4,10 h -2 v 2 h 2 z" className={classes} />
        <path d="M 8,11 h 6" className={classes} />
      </svg>
    </div>
  );
}
