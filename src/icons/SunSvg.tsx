export default function SunSvg({ classes = ' fill-current stroke-current stroke-2 ' }) {
  return (
    <svg id="untick-svg" role="img" aria-label="Toggle Off" height="100%" width="100%" viewBox="0 0 32 32">
      <circle
        cx="16"
        cy="16"
        r="13.5"
        style={{
          strokeLinecap: 'round',
        }}
        className="fill-none stroke-current stroke-2"
      />
      <path
        d="m 16.075465,4.0002373 a 12,12 0 0 1 10.357407,6.0705827 12,12 0 0 1 -0.08473,12.005027 12,12 0 0 1 -10.44206,5.923785 L 16,16 Z"
        style={{
          strokeLinecap: 'round',
        }}
        className={classes}
      />
    </svg>
  );
}
