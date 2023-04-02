import { useState } from 'react';
import { ColourObj } from '../../../contexts/ColourInputProvider';
import RatingTable from './RatingTable';
import { contrast } from '../../../utilities/colour/contrastRatio';

function getElementColours(backgroundObject: ColourObj, foregroundObject: ColourObj, contrastNumber: number) {
  const autoTextBackground = backgroundObject.Autocolour === 'Black' ? '#000000' : '#ffffff';
  const autoTextForeground = foregroundObject.Autocolour === 'Black' ? '#000000' : '#ffffff';

  const borderBackground = contrastNumber >= 3 ? `${foregroundObject.Hex}` : autoTextBackground;
  // const borderForeground = contrastNumber >= 3 ? `${backgroundObject.Hex}` : autoTextForeground;

  const largeTextBackground = contrastNumber >= 3 ? `${foregroundObject.Hex}` : autoTextBackground;
  // const largeTextForeground = contrastNumber >= 3 ? `${backgroundObject.Hex}` : autoTextForeground;

  const smallTextBackground = contrastNumber >= 4.5 ? `${foregroundObject.Hex}` : autoTextBackground;
  const smallTextForeground = contrastNumber >= 4.5 ? `${backgroundObject.Hex}` : autoTextForeground;

  const backgroundHex = backgroundObject.Hex;
  const foregroundHex = foregroundObject.Hex;
  const backgroundName = backgroundObject.Name;
  const foregroundName = foregroundObject.Name;

  return {
    borderBackground,
    // borderForeground,
    largeTextBackground,
    // largeTextForeground,
    smallTextBackground,
    smallTextForeground,
    backgroundHex,
    foregroundHex,
    backgroundName,
    foregroundName,
  };
}

// function getHexData(colourObject: ColourObj) {
//   const { Hex, HSL, RGB, Luminance, Black, White } = colourObject;
//   // return `Contrast Black/White: ${Black}/${White}\r\nRelative Luminance: ${Luminance} \r\n${`Hex:${Hex}\r\n`}${`${HSL}\r\n`}${`${RGB}\r\n`}`;
//   return `Relative Luminance: ${Luminance}`;
// }

export default function ColourDemo({
  backgroundObject,
  foregroundObject,
  contrastNumberIn,
}: {
  backgroundObject: ColourObj;
  foregroundObject: ColourObj;
  contrastNumberIn: number;
}) {
  const [swap, setSwap] = useState(false);

  const rating = contrast.makeContrastRating(contrastNumberIn);

  const {
    borderBackground,
    largeTextBackground,
    smallTextBackground,
    smallTextForeground,
    backgroundHex,
    foregroundHex,
    backgroundName,
    foregroundName,
  } = swap
    ? getElementColours(foregroundObject, backgroundObject, contrastNumberIn)
    : getElementColours(backgroundObject, foregroundObject, contrastNumberIn);
  return (
    <div
      style={{ backgroundColor: backgroundHex }}
      className=" relative mx-auto my-4 flex h-max w-80 shrink-0 grow-0 flex-col items-center gap-2 overflow-clip rounded-[2.4rem] border border-border bg-inherit p-0 py-2"
    >
      <div
        style={{ borderColor: borderBackground }}
        className="mx-auto mt-2 flex  w-72 flex-wrap justify-center gap-2 rounded border-4 p-2"
      >
        <p style={{ color: smallTextBackground }} className="m-0 my-auto text-sm">
          Contrast Ratio:
        </p>
        <h2
          style={{ color: largeTextBackground }}
          className=" w-fit font-bold"
        >{`${contrastNumberIn} : 1  (${rating})`}</h2>
      </div>
      {/* <div style={{ borderColor: borderBackground, color: smallTextBackground }} className='flex gap-2 rounded-full overflow-clip border-4 w-72 mx-auto mt-2 p-2'>
      <button  role='button' className='rounded-none text-sm'>Small Text Rating:</button>
      <b style={{ backgroundColor: backgroundHex }} className='bg-transparent mx-auto'>AAA+</b>
      </div > */}

      <div style={{ color: smallTextBackground }} className="mx-auto w-fit">
        <RatingTable ratingString={rating} />
      </div>

      <div style={{ backgroundColor: foregroundHex }} className="mx-auto mt-2 w-72 rounded">
        <div className="mx-auto flex w-fit flex-wrap justify-center gap-2 p-2 ">
          <p style={{ color: smallTextForeground }} className="my-auto h-fit w-fit text-sm">
            Foreground Colour:
          </p>
          <b style={{ color: smallTextForeground }} className="my-auto w-fit">
            {foregroundName}
          </b>
        </div>
      </div>

      <div className="mx-auto mt-2 flex w-72 flex-wrap justify-center gap-2">
        <p style={{ color: smallTextBackground }} className="my-auto h-fit pl-2 text-sm">
          Background Colour:
        </p>
        <b style={{ color: smallTextBackground }} className="my-auto w-fit">
          {backgroundName}
        </b>
      </div>

      <button
        id="swap-btn"
        style={{ borderColor: borderBackground }}
        className="active:deco mx-auto mt-2 w-fit rounded-full border-4  bg-deco p-2 text-sm text-current  hover:bg-txt-low hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
        type="button"
        onClick={() => {
          setSwap((value) => !value);
        }}
      >
        Swap Colours
      </button>
    </div>
  );
}
