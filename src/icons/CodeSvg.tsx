export default function CodeSvg(props: { classes: string }) {
  const { classes } = props;
  return (
    <div className="pointer-events-none m-1 h-6 w-6">
      <svg id="code-svg" aria-label="Code" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 6,4 2,8 6,12" className={classes} />
        <path d="m 10,4 4,4 -4,4" className={classes} />
      </svg>
    </div>
  );
}
