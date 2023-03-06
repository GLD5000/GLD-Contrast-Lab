import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { luminance } from '../../utilities/colour/luminance';

function getColourString(hexCode: string, mode: string) {
  if (mode === 'hex') return `hex\r\n${hexCode.slice(1)}`;

  const colourStringCallbacks: { [elemName: string]: string } = {
    luminance: `luminance\r\n${luminance.convertHexToLuminancePercent(hexCode)}`,
    hsl: colourSpace.convertHexToHslStringLb(hexCode),
    rgb: colourSpace.convertHextoRgbStringLb(hexCode),
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
  if (autoColour)
    return (
      <p className="m-0 whitespace-pre-wrap text-sm underline decoration-current underline-offset-2">{colourString}</p>
    );
  return <b className="text-sm">{showRatio ? contrastRatio : contrastRating}</b>;
}

export default function ColourBlock({
  backgroundColour = '#b0b0b0',
  textColour = '#000000',
  autoColour,
  contrastRating,
  contrastRatio,
}: {
  backgroundColour: string;
  textColour: string;
  autoColour: boolean;
  contrastRating: string;
  contrastRatio: number;
}) {
  const { showRatio, showPoor, colourMode, dispatchColourBlocks } = useColourBlocksContext();
  const poorContrast = contrastRatio < 3;
  if (!backgroundColour || !textColour) return null;

  function handleClickColourMode() {
    const nextMode: { [elemName: string]: string } = {
      hex: 'luminance',
      luminance: 'hsl',
      hsl: 'rgb',
      rgb: 'hex',
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
  const style: { [elemName: string]: string } = {
    // backgroundColor: backgroundColour,
    color: poorContrast && showPoor === false ? 'transparent' : textColour,
    borderColor: autoColour || poorContrast ? 'transparent' : textColour,
  };
  const colourString = autoColour
    ? getColourString(backgroundColour, colourMode)
    : `hex\r\n${backgroundColour.slice(1)}`;
  const returnContent = getContent(showRatio, contrastRatio, contrastRating, autoColour, colourString);
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={handleClick}
      className={` text-m grid aspect-square h-20  items-center  overflow-clip border-2 text-center text-current ${
        !autoColour && 'rounded-full'
      } background-transparent`}
      style={style}
    >
      {returnContent}
    </button>
  );
}
