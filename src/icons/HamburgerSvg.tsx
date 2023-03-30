export default function HamburgerSvg({
  wrapperClasses = ' pointer-events-none h-8 w-6 block fill-current my-auto',
  classes = ' fill-current stroke-none ',
}) {
  return (
    <div className={wrapperClasses}>
      <svg id="untick-svg" role="img" aria-label="Toggle Off" height="100%" width="100%" viewBox="0 0 8 32">
        <circle className={classes} cx="4" cy="6" r="3" />
        <circle className={classes} cx="4" cy="16" r="3" />
        <circle className={classes} cx="4" cy="26" r="3" />
      </svg>
    </div>
  );
}
