export default function MoonSvg({ classes = 'stroke-current fill-current stroke-2 ' }) {
  return (
    <div className="pointer-events-none h-full w-full">
      <svg
        style={{
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
        id="add-svg"
        role="img"
        aria-label="Add Section"
        height="100%"
        width="100%"
        viewBox="0 0 32 32"
      >
        <path
          d="M 17.935362,1.8367745 A 13,13 0 0 1 22.211948,9.09614 13,13 0 0 1 12.089693,24.443451 13,13 0 0 1 3.7538255,23.346274 14,14 0 0 0 18.193469,29.316225 14,14 0 0 0 29.094359,12.788351 14,14 0 0 0 17.935362,1.8367745 Z"
          className={classes}
        />
      </svg>
    </div>
  );
}
