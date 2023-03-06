export default function SunSvg({ classes = 'stroke-current fill-current stroke-2 ' }) {
  return (
    <svg id="untick-svg" role="img" aria-label="Toggle Off" height="100%" width="100%" viewBox="0 0 16 16">
      <circle
        cx="8"
        cy="8"
        r="5"
        style={{
          strokeLinecap: 'round',
        }}
        className={classes}
      />
    </svg>
  );
}
