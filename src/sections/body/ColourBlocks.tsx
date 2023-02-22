import { Dispatch, SetStateAction, useState } from 'react';
import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';

function getBlockRow(
  backgroundColour: string,
  index: number,
  array: string[],
  clicked: boolean,
  setClicked: Dispatch<SetStateAction<boolean>>,
) {
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
  return { keyA, rowArray };
}

function createColourBlockArrays(
  coloursArray: Array<string>,
  clicked: boolean,
  setClicked: Dispatch<SetStateAction<boolean>>,
) {
  return coloursArray.map((backgroundColour, index, array) => {
    const { keyA, rowArray } = getBlockRow(backgroundColour, index, array, clicked, setClicked);
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
  const returnArrays = createColourBlockArrays(textArray, clicked, setClicked);
  return <div className=" w-fit self-center overflow-clip rounded-lg border-2 border-current">{returnArrays}</div>;
}
export default function ColourBlocks({ textArray }: { textArray: Array<string> }) {
  const [clicked, setClicked] = useState(false);
  if (textArray[0] === undefined) return null;
  const colourBlocks = getColourBlocks(textArray, clicked, setClicked);
  return colourBlocks;
}
