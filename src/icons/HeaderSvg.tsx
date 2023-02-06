export default function HeaderSvg(props: { classes: string }) {
  const { classes } = props;
  return (
    <div className="pointer-events-none m-1 h-6 w-6">
      <svg id="header-svg" aria-label="Header" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 4,4 V 12" className={classes} />
        <path d="m 4,8 h 8" className={classes} />
        <path d="M 12,4 V 12" className={classes} />
      </svg>
    </div>
  );
}
