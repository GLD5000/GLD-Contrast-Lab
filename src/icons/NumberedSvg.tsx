export default function NumberedSvg({ classes = 'stroke-current fill-none stroke-1' }) {
  return (
    <div className="pointer-events-none m-1 h-full w-full">
      <svg id="numbered-svg" role="img" aria-label="Numbered" height="100%" width="100%" viewBox="0 0 16 16">
        <path
          d="M 2.9024007,6.1045699 H 3.7617751 V 3.1384258 L 2.8268799,3.3259257 V 2.8467593 L 3.7565668,2.6592594 h 0.5260414 v 3.4453105 h 0.8593745 v 0.442708 h -2.239582 z"
          className={classes}
        />

        <path d="M 8,4 h 6" className={classes} />
        <path
          d="M 3.2643796,12.300631 H 5.100316 V 12.74334 H 2.6315675 V 12.300631 Q 2.9310465,11.990736 3.4466712,11.469903 3.9649,10.946466 4.0977124,10.795424 4.3503165,10.51157 4.4492747,10.316258 4.5508372,10.118341 4.5508372,9.928237 q 0,-0.3098956 -0.2187499,-0.505208 -0.2161457,-0.1953124 -0.5651038,-0.1953124 -0.2473957,0 -0.5234372,0.085937 -0.2734374,0.085937 -0.5859372,0.2604165 V 9.0428209 q 0.3177082,-0.1276041 0.5937497,-0.1927082 0.2760415,-0.065104 0.505208,-0.065104 0.6041663,0 0.9635411,0.3020831 0.3593748,0.3020832 0.3593748,0.8072912 0,0.239583 -0.091146,0.455729 -0.088542,0.213541 -0.3255206,0.505208 -0.065104,0.07552 -0.4140623,0.4375 -0.3489581,0.359374 -0.9843742,1.007811 z"
          className={classes}
        />
        <path d="M 8,11 h 6" className={classes} />
      </svg>
    </div>
  );
}
