import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { luminance } from '../../utilities/colour/luminance';

function getColourString(hexCode: string, mode: string) {
  if (mode === 'Hex') return `Hex\r\n${hexCode.slice(1)}`;

  const colourStringCallbacks: { [key: string]: string } = {
    Luminance: `Lum\r\n${luminance.convertHexToLuminancePercent(hexCode)}`,
    HSL: colourSpace.convertHexToHslStringLb(hexCode),
    RGB: colourSpace.convertHextoRgbStringLb(hexCode),
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
  const { showRatio, showPoor, colourMode, dispatchColourBlocks } = useColourBlocksContext();
  const poorContrast = contrastRatio < 3;
  if (!backgroundColour || !textColour) return null;

  function handleClickColourMode() {
    const nextMode: { [key: string]: string } = {
      Hex: 'Luminance',
      Luminance: 'HSL',
      HSL: 'RGB',
      RGB: 'Hex',
    };

    dispatchColourBlocks({ colourMode: nextMode[colourMode] });
  }

  function handleClick() {
    if (autoColour) {
      handleClickColourMode();
      return;
    }
    const dispatchObject = poorContrast ? { showPoor: !showPoor } : { showRatio: !showRatio };
    dispatchColourBlocks(dispatchObject);
  }
  const style: { [key: string]: string } = {
    // backgroundColor: backgroundColour,
    color: poorContrast && showPoor === false ? 'transparent' : textColour,
    borderColor: autoColour || poorContrast ? 'transparent' : borderColour,
  };
  const colourString = autoColour
    ? getColourString(backgroundColour, colourMode)
    : `Hex\r\n${backgroundColour.slice(1)}`;
  const returnContent = getContent(showRatio, contrastRatio, contrastRating, autoColour, colourString);
  const border = autoColour ? 'border-none' : 'border-2';
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
