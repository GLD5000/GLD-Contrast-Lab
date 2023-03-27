export default function HeroSection() {
  return (
    <div className="mx-auto grid">
      <div className=" mx-auto mt-24 flex flex-row overflow-clip rounded-lg border-2 border-current ">
        <h1 className=" rounded-none bg-white p-3 font-black  leading-6 text-black sm:p-[0.95rem] sm:text-6xl">
          CONTRAST
        </h1>
        <h1 className="  rounded-none bg-black p-3 font-black leading-6 text-white sm:p-[0.95rem] sm:text-6xl">TOOL</h1>
      </div>
      <b className="mx-auto mt-2 mb-20 w-fit text-center text-xl">Create Accessible Colour Combinations</b>
      <p>
        Quickly compare any number of colours and ensure that they meet current standards for visual Contrast Ratios
        outlined in the Web Content Accessibility Guidelines (WCAG) 2.1.
      </p>
      <a className=" underline" href="https://glddevtips.web.app/?title=WCAG%202.1%20Contrast%20Guidance">
        Read a brief summary of the Contrast Ratio Guidance on GLD DevTips
      </a>
    </div>
  );
}
