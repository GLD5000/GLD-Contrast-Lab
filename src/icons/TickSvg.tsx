export default function TickSvg() {
  return (
    <div className="pointer-events-none h-6 w-6">
      <svg id="tick-svg" aria-label="Toggle On" height="100%" width="100%" viewBox="0 0 16 16">
        <circle
          cx="8"
          cy="8"
          r="6.5"
          style={{
            stroke: '#000000',
            strokeWidth: '1.5',
            strokeLinecap: 'round',
            fill: 'none',
          }}
        />
        <path
          d="M 4.4493325,8.0000309 6.9936275,11.101361 10.85,5"
          style={{
            stroke: '#000000',
            strokeWidth: '2',
            strokeLinecap: 'round',
            fill: 'none',
          }}
        />
      </svg>
    </div>
  );
}
