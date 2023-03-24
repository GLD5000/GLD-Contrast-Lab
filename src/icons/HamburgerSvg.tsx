export default function HamburgerSvg({
  wrapperClasses = ' pointer-events-none h-8 block sm:hidden aspect-square fill-current',
  classes = ' fill-current stroke-current stroke-2 ',
}) {
  return (
    <div className={wrapperClasses}>
      <svg id="untick-svg" role="img" aria-label="Toggle Off" height="100%" width="100%" viewBox="0 0 32 32">
        <path
          d="M 2.6225254e-4,11.943286 H 32.000263 c -0.144865,-4.865579 -2.172202,-8.0897156 -8,-8.0000001 H 8.0002623 C 2.8550446,3.9972343 -0.04513216,6.4177508 2.6225254e-4,11.943286 Z"
          style={{
            strokeLinecap: 'round',
          }}
          className={classes}
        />

        <path
          d="M 2.6250168e-4,23.998174 H 32.000263 c -0.144865,4.865579 -2.172202,8.089715 -8,8 H 8.0002625 c -5.1452177,-0.05395 -8.04539441,-2.474465 -7.99999999832,-8 z"
          style={{
            strokeLinecap: 'round',
          }}
          className={classes}
        />
        <path
          d="m 0,15.97073 h 32 v 4 H 0 Z"
          style={{
            strokeLinecap: 'round',
          }}
          className={classes}
        />
      </svg>
    </div>
  );
}
