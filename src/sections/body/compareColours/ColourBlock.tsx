import { useEffect } from 'react';
import { useColourBlocksContext } from '../../../contexts/ColourBlocksProvider';
import { useColourInputContext, ColourObj } from '../../../contexts/ColourInputProvider';

function breakName(input: string) {
  if (input.length < 10) return input;
  if (input.slice(0, 9).includes('-')) return input;
  const indexUpper = input.search(/[A-Z]/);
  // console.log('indexUpper:', indexUpper);
  if (indexUpper > 4 && indexUpper < 10) return `${`${input}`.slice(0, indexUpper)}-${`${input}`.slice(indexUpper)}`;

  return `${`${input}`.slice(0, 8)}-${`${input}`.slice(8)}`;
}

function getColourString(objectIn: ColourObj, mode: string) {
  if (objectIn === undefined) return undefined;
  const { Hex, Luminance, Name, HSL, RGB } = objectIn;
  const breakableName = breakName(`${Name}`);
  const colourStringCallbacks: { [key: string]: string } = {
    Hex: `Hex\r\n${`${Hex}`.slice(1)}`,
    Name: `${breakableName}`,
    Luminance: `Lum\r\n${Luminance}`,
    HSL: `${HSL}`,
    RGB: `${RGB}`,
  };
  return colourStringCallbacks[mode];
}
function getContent(
  showRatio: boolean,
  contrastRatio: number,
  contrastRating: string,
  autoColour: boolean,
  colourString: string,
) {
  if (autoColour) return <b className=" whitespace-pre-wrap text-xs ">{colourString}</b>;
  return <p className="m-0 text-xs">{showRatio ? contrastRatio : contrastRating}</p>;
}

export default function ColourBlock({
  backgroundColour = '#b0b0b0',
  textColour = '#000000',
  autoColour,
  contrastRating,
  contrastRatio,
  borderColour = '#000000',
}: {
  backgroundColour: string;
  textColour: string;
  autoColour: boolean;
  contrastRating: string;
  contrastRatio: number;
  borderColour: string;
}) {
  const { showRatio, contrastRatioLimit, colourMode, dispatchColourBlocks } = useColourBlocksContext();
  const { colourMap, dispatchColourInput } = useColourInputContext();
  const poorContrast = contrastRatio < 3;
  useEffect(() => {
    let mounted = true;

    if (mounted && backgroundColour !== borderColour) {
      const coloursArray = [backgroundColour, borderColour].sort();
      dispatchColourBlocks({
        type: 'ADD_COMBO',
        key: coloursArray.join('/'),
        value: { colours: coloursArray, ratio: contrastRatio, rating: contrastRating },
      });
    }
    return () => {
      mounted = false;
    };
  }, [backgroundColour, dispatchColourBlocks, borderColour, contrastRatio, contrastRating]);

  if (!backgroundColour || !textColour) return null;

  const colourObject = colourMap?.get(backgroundColour);
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

  function handleClick() {
    if (autoColour) {
      handleClickColourMode();
      return;
    }
    dispatchColourInput({ type: 'ASSIGN_COMBO_COLOURS', payload: { tag: backgroundColour, tagB: borderColour } });
    dispatchColourBlocks({ comboEdit: false });
  }

  const hidePoorColour = contrastRatio < contrastRatioLimit && !autoColour;
  const hideBorder = contrastRatio < 3 || contrastRatio < contrastRatioLimit;
  const style: { [key: string]: string } = {
    // backgroundColor: backgroundColour,
    color: hidePoorColour ? 'transparent' : textColour,
    borderColor: hideBorder ? 'transparent' : borderColour,
  };
  const colourString =
    autoColour && colourObject ? getColourString(colourObject, colourMode) : `Hex\r\n${backgroundColour.slice(1)}`;
  const returnContent = getContent(
    showRatio,
    contrastRatio,
    contrastRating,
    autoColour,
    colourString || backgroundColour,
  );
  const border = poorContrast ? 'border' : 'border-2';
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={handleClick}
      className={` text-m grid aspect-square w-16  items-center  overflow-clip ${border} text-center text-current ${
        !autoColour && 'rounded-full'
      } background-transparent`}
      style={style}
    >
      {returnContent}
    </button>
  );
}
