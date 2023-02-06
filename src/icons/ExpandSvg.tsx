export default function ExpandSvg() {
  return (
    <div className="pointer-events-none m-1 h-6 w-6">
      <svg id="expand-svg" role="img" aria-label="Expand" height="100%" width="100%" viewBox="0 0 10 10">
        <path
          d="M 1,1
    L 5,5 
    L 9,1"
          style={{
            stroke: '#ffffff',
            strokeWidth: '20%',
            strokeLinecap: 'round',
            fill: 'none',
          }}
        />
      </svg>
    </div>
  );
}
