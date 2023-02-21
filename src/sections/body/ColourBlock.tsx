import { Dispatch, SetStateAction } from 'react';
import H2 from '../../elements/H2';
import P from '../../elements/P';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';

export default function ColourBlock({
  backgroundColour = '#b0b0b0',
  textColour = '#000000',
  clicked = false,
  setClicked = () => {},
}: {
  backgroundColour: string;
  textColour: string;
  clicked: boolean;
  setClicked: Dispatch<SetStateAction<boolean>>;
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
  if (contrastRatio < 4.5) return null;
  return (
    <button
      type="button"
      onClick={handleClick}
      className="m-1 grid aspect-square h-36 content-center rounded-xl border text-center text-lg text-current"
      style={style}
    >
      <P content={backgroundColour} />
      <H2 content={clicked ? contrastRatio : contrastRating} />
      <P content={textColour} />
    </button>
  );
}
