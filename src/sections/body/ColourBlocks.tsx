import { Dispatch, SetStateAction, useState } from 'react';
import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';

function createColourBlockArrays(
  coloursArray: Array<string>,
  clicked: boolean,
  setClicked: Dispatch<SetStateAction<boolean>>,
) {
  return coloursArray.map((backgroundColour, index, array) => {
    const keyA = `${backgroundColour}${index}`;
    const rowArray = array.map((textColour, number) => {
      const keyB = `${textColour}${number}`;
      const autoColour = textColour === backgroundColour;
      const textColourMod = autoColour ? autoTextColourFromHex(backgroundColour) : textColour;
      const contrastRatio = Number(getContrastRatioFromHex(backgroundColour, textColourMod).toFixed(2));
      const contrastRating = contrast.makeContrastRating(contrastRatio);

      return (
        <ColourBlock
          key={`${keyA}-${keyB}`}
          backgroundColour={backgroundColour}
          textColour={textColourMod}
          clicked={clicked}
          setClicked={setClicked}
          autoColour={autoColour}
          contrastRating={contrastRating}
          contrastRatio={contrastRatio}
        />
      );
    });
    return (
      <div
        key={`${backgroundColour}-${keyA}`}
        style={{ backgroundColor: backgroundColour }}
        className="flex flex-row flex-wrap rounded-none"
      >
        {rowArray}
      </div>
    );
  });
}

function getColourBlocks(textArray: Array<string>, clicked: boolean, setClicked: Dispatch<SetStateAction<boolean>>) {
  return createColourBlockArrays(textArray, clicked, setClicked);
}
export default function ColourBlocks({ textArray }: { textArray: Array<string> }) {
  const [clicked, setClicked] = useState(false);
  if (textArray[0] === undefined) return null;
  const colourBlocks = getColourBlocks(textArray, clicked, setClicked);
  return <div className=" overflow-clip rounded-lg border-2 border-current">{colourBlocks}</div>;
}