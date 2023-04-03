import { useState } from 'react';
import { ColourObj, useColourInputContext } from '../../../contexts/ColourInputProvider';
import RatingTable from './RatingTable';
import { contrast } from '../../../utilities/colour/contrastRatio';
import { useColourBlocksContext } from '../../../contexts/ColourBlocksProvider';
import EditSlider from './EditSlider';
import SvgButtonNew from '../../../elements/SvgButtonNew';
import PencilSvg from '../../../icons/PencilSvg';

function getElementColours(
  backgroundObject: ColourObj,
  foregroundObject: ColourObj,
  contrastNumber: number,
  colourMode: string,
  greyscale: boolean,
) {
  const backgroundName =
    colourMode === 'Hex' || colourMode === 'Luminance'
      ? getColourString(backgroundObject, colourMode)
      : backgroundObject[colourMode];
  const foregroundName =
    colourMode === 'Hex' || colourMode === 'Luminance'
      ? getColourString(foregroundObject, colourMode)
      : foregroundObject[colourMode];
  const backgroundHex = backgroundObject.Hex;
  const foregroundHex = foregroundObject.Hex;

  const autoTextBackground = backgroundObject.Autocolour === 'Black' ? '#000000' : '#ffffff';
  const autoTextForeground = foregroundObject.Autocolour === 'Black' ? '#000000' : '#ffffff';

  if (greyscale)
    return {
      borderBackground: foregroundHex,
      // borderForeground,
      largeTextBackground: foregroundHex,
      // largeTextForeground,
      smallTextBackground: foregroundHex,
      smallTextForeground: backgroundHex,
      backgroundHex,
      foregroundHex,
      backgroundName,
      foregroundName,
      autoTextBackground,
    };

  const borderBackground = contrastNumber >= 3 ? `${foregroundObject.Hex}` : autoTextBackground;
  // const borderForeground = contrastNumber >= 3 ? `${backgroundObject.Hex}` : autoTextForeground;

  const largeTextBackground = contrastNumber >= 3 ? `${foregroundObject.Hex}` : autoTextBackground;
  // const largeTextForeground = contrastNumber >= 3 ? `${backgroundObject.Hex}` : autoTextForeground;

  const smallTextBackground = contrastNumber >= 4.5 ? `${foregroundObject.Hex}` : autoTextBackground;
  const smallTextForeground = contrastNumber >= 4.5 ? `${backgroundObject.Hex}` : autoTextForeground;

  function getColourString(objectIn: ColourObj, mode: string) {
    if (objectIn === undefined) return undefined;
    const { Hex, Luminance } = objectIn;
    const colourStringCallbacks: { [key: string]: string } = {
      Hex: `Hex ${`${Hex}`.slice(1)}`,
      Luminance: `Relative Luminance ${Luminance}`,
    };
    return colourStringCallbacks[mode];
  }
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
    autoTextBackground,
  };
}

// function getHexData(colourObject: ColourObj) {
//   const { Hex, HSL, RGB, Luminance, Black, White } = colourObject;
//   // return `Contrast Black/White: ${Black}/${White}\r\nRelative Luminance: ${Luminance} \r\n${`Hex:${Hex}\r\n`}${`${HSL}\r\n`}${`${RGB}\r\n`}`;
//   return `Relative Luminance: ${Luminance}`;
// }

export default function ColourDemo() {
  const [editing, setEditing] = useState(false);
  const [editHex, setEditHex] = useState('');
  const [grey, setGrey] = useState(false);
  const { colourMode, dispatchColourBlocks } = useColourBlocksContext();
  const { dispatchColourInput, recentColour, previousColour } = useColourInputContext();

  const contrastNumberIn = previousColour?.contrast || 1;
  const rating = contrast.makeContrastRating(contrastNumberIn);
  function handleClickColourMode() {
    const nextMode: { [key: string]: string } = {
      Hex: 'Luminance',
      Luminance: 'HSL',
      HSL: 'RGB',
      RGB: 'Name',
      Name: 'Hex',
    };

    dispatchColourBlocks({ colourMode: nextMode[colourMode] });
  }
  if (!recentColour || !previousColour) return null;
  const {
    largeTextBackground,
    smallTextBackground,
    smallTextForeground,
    backgroundHex,
    foregroundHex,
    backgroundName,
    foregroundName,
    autoTextBackground,
  } = getElementColours(recentColour, previousColour, contrastNumberIn, colourMode, grey);
  function handleEdit() {
    if (!editing) {
      setEditHex(backgroundHex);
      dispatchColourInput({ type: 'EDIT_COMBO', payload: { textInput: backgroundHex } });
    }
    if (editing) dispatchColourInput({ type: 'ASSIGN_COMBO_COLOURS', payload: { tag: editHex } });
    setEditing((value) => !value);
    setGrey(false);
  }

  return (
    <div
      style={{ backgroundColor: backgroundHex, color: smallTextBackground }}
      className={`relative mx-auto my-4 flex h-max w-80 shrink-0 grow-0 flex-col items-center gap-2 overflow-clip rounded-[2.4rem] border border-border bg-inherit p-0 py-4 ${
        grey && ' grayscale'
      }`}
    >
      <div
        style={{ borderColor: foregroundHex }}
        className="mx-auto flex  w-72 flex-wrap justify-center gap-2 rounded-3xl border-4 p-1"
      >
        <p style={{ color: smallTextBackground }} className="m-0 my-auto text-xs">
          Contrast Ratio:
        </p>
        <h1
          style={{ color: largeTextBackground }}
          className=" w-full text-center font-bold"
        >{`${contrastNumberIn} : 1  (${rating})`}</h1>
        <div style={{ color: smallTextBackground }} className="mx-auto w-full">
          <RatingTable ratingString={rating} />
        </div>
      </div>
      {/* <div style={{ borderColor: borderBackground, color: smallTextBackground }} className='flex gap-2 rounded overflow-clip border-4 w-72 mx-auto mt-2 p-2'>
      <button   className='rounded-none text-sm'>Small Text Rating:</button>
      <b style={{ backgroundColor: backgroundHex }} className='bg-transparent mx-auto'>AAA+</b>
      </div > */}

      <button
        type="button"
        onClick={handleClickColourMode}
        aria-label="Change Colour Mode"
        style={{ backgroundColor: foregroundHex }}
        className="mx-auto mt-2 flex h-fit w-72 flex-wrap justify-center gap-2 rounded border-2 border-transparent p-2 hover:border-current hover:transition focus:border-current focus:transition"
      >
        <p style={{ color: smallTextForeground }} className="my-auto h-fit w-fit text-sm">
          Foreground Colour:
        </p>
        <b style={{ color: smallTextForeground }} className="my-auto w-fit">
          {foregroundName}
        </b>
      </button>

      <button
        type="button"
        onClick={handleClickColourMode}
        aria-label="Change Colour Mode"
        className="mx-auto mt-2 flex w-72 flex-wrap justify-center gap-2 rounded border-2 border-transparent p-2 hover:border-current hover:transition focus:border-current focus:transition"
      >
        <p style={{ color: smallTextBackground }} className="my-auto h-fit pl-2 text-sm">
          Background Colour:
        </p>
        <b style={{ color: smallTextBackground }} className="my-auto w-fit">
          {backgroundName}
        </b>
      </button>

      <div style={{ color: autoTextBackground }} className="grid w-full grid-cols-3 flex-row items-center gap-2 px-4">
        <SvgButtonNew
          clickFunction={handleEdit}
          id="edit-bg-colour"
          name="Edit Background Colour"
          showTextIn
          className=" my-auto flex w-full grow-0 gap-2 whitespace-pre-wrap rounded border-2 border-transparent px-2 py-1   hover:border-current hover:transition focus:border-current focus:transition"
          reverse={false}
          buttonClasses={undefined}
          svg={
            <div className="aspect-square h-6 grow-0 rounded-none p-0 text-xs">
              <PencilSvg />
            </div>
          }
          textElement={<span className="m-0 grow-0 p-0">Edit</span>}
        />
        <button
          id="swap-btn"
          className="active:deco my-auto w-full rounded border-2 border-transparent px-2 py-1   hover:border-current hover:transition focus:border-current focus:transition"
          type="button"
          onClick={() => {
            setGrey((value) => !value);
          }}
        >
          Grey
        </button>
        {!editing && (
          <button
            id="swap-btn"
            className="active:deco my-auto w-full rounded border-2 border-transparent px-2 py-1   hover:border-current hover:transition focus:border-current focus:transition"
            type="button"
            onClick={() => {
              dispatchColourInput({ type: 'SWAP_COMBO_COLOURS', payload: { textInput: '' } });
            }}
          >
            Swap
          </button>
        )}
      </div>
      {editing && (
        <EditSlider
          cancelHex={editHex}
          cancelEdit={() => {
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}
