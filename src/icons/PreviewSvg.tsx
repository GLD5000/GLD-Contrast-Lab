export default function PreviewSvg({ classes }: { classes: string }) {
  return (
    <div className="pointer-events-none m-1 h-6 w-6">
      <svg id="add-svg" role="img" aria-label="Add Section" height="100%" width="100%" viewBox="0 0 16 16">
        <path d="M 2,8 Q 8,2 14,8 M 2,8 Q 8,15 14,8 " className={`${classes} fill-none`} />
        <circle cx="8" cy="8" r="2" className={`${classes} fill-current`} />
      </svg>
    </div>
  );
}
