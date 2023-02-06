export default function TableSvg(props: { classes: string }) {
  const { classes } = props;
  return (
    <div className="pointer-events-none m-1 h-6 w-6">
      <svg id="table-svg" role="img" aria-label="Table" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 2,3 H 14 V 7 H 2 V 3 13 H 14 V 7" className={classes} />
      </svg>
    </div>
  );
}
