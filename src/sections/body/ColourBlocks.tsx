import { Dispatch, SetStateAction, useState } from 'react';
import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { getContrastRatioFromHex, contrast } from '../../utilities/colour/contrastRatio';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

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
  coloursArray: Set<string>,
  clicked: boolean,
  setClicked: Dispatch<SetStateAction<boolean>>,
) {
  return [...coloursArray].sort().map((backgroundColour, index, array) => {
    const { keyA, rowArray } = getBlockRow(backgroundColour, index, array, clicked, setClicked);
    return (
      <div
        key={`${backgroundColour}-${keyA}`}
        style={{ backgroundColor: backgroundColour }}
        className="flex flex-row flex-wrap rounded-none p-8"
      >
        {rowArray}
      </div>
    );
  });
}

function getColourBlocks(colourSet: Set<string>, clicked: boolean, setClicked: Dispatch<SetStateAction<boolean>>) {
  const returnArrays = createColourBlockArrays(colourSet, clicked, setClicked);
  return <div className=" w-fit self-center overflow-clip rounded-xl ">{returnArrays}</div>;
}
export default function ColourBlocks() {
  const { colourSet } = useColourInputContext();
  const [clicked, setClicked] = useState(false);
  if ([...colourSet][0] === undefined) return null;
  const colourBlocks = getColourBlocks(colourSet, clicked, setClicked);
  return colourBlocks;
}
