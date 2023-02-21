import { Dispatch, SetStateAction } from 'react';
import H2 from '../../elements/H2';
import P from '../../elements/P';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';

function getContent(
  backgroundColour: string,
  textColour: string,
  clicked: boolean,
  contrastRatio: number,
  contrastRating: string,
  autoColour: boolean,
) {
  if (contrastRatio < 3) return null;
  if (autoColour) return <P content={backgroundColour} />;

  return <H2 content={clicked ? contrastRatio : contrastRating} />;
}

export default function ColourBlock({
  backgroundColour = '#b0b0b0',
  textColour = '#000000',
  clicked = false,
  setClicked = () => {},
  autoColour,
}: {
  backgroundColour: string;
  textColour: string;
  clicked: boolean;
  setClicked: Dispatch<SetStateAction<boolean>>;
  autoColour: boolean;
}) {
  function handleClick() {
    setClicked((click) => !click);
  }
  const style: { [elemName: string]: string } = {
    backgroundColor: backgroundColour,
    color: textColour,
    borderColor: textColour,
  };
  const contrastRatio = Number(getContrastRatioFromHex(backgroundColour, textColour).toFixed(2));
  const contrastRating = contrast.makeContrastRating(contrastRatio);
  const returnContent = getContent(backgroundColour, textColour, clicked, contrastRatio, contrastRating, autoColour);
  return (
    <button
      type="button"
      onClick={handleClick}
      className="m-1 grid aspect-square h-24 content-center rounded-full border-2 text-center text-lg text-current"
      style={style}
    >
      {returnContent}
    </button>
  );
}
