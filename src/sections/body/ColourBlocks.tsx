import { Dispatch, SetStateAction, useState } from 'react';
import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';

function createColourBlockArrays(
  coloursArray: Array<string>,
  clicked: boolean,
  setClicked: Dispatch<SetStateAction<boolean>>,
) {
  return coloursArray.map((backgroundColour, _, array) => {
    const keyA = `${backgroundColour}`;
    const rowArray = array.map((textColour) => {
      const keyB = `${textColour}`;
      const autoColour = textColour === backgroundColour;
      const textColourMod = autoColour ? autoTextColourFromHex(backgroundColour) : textColour;
      return (
        <ColourBlock
          key={`${keyA}-${keyB}`}
          backgroundColour={backgroundColour}
          textColour={textColourMod}
          clicked={clicked}
          setClicked={setClicked}
          autoColour={autoColour}
        />
      );
    });
    return (
      <div key={`${backgroundColour}-${keyA}`} className="flex flex-row">
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
  const colourBlocks = getColourBlocks(textArray, clicked, setClicked);
  return <div>{colourBlocks}</div>;
}
