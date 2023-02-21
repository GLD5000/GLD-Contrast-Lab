import { Dispatch, SetStateAction, useState } from 'react';
import ColourBlock from './ColourBlock';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';

function processHexString(hex: string) {
  if (hex[0] !== '#' || hex.length < 2 || hex.slice(1).search(/#|[^0-9a-f]/) > -1) return '';
  let modifiedHex = hex.length > 7 ? hex.slice(0, 7) : hex;
  if (hex.length < 5) {
    const characters = hex.slice(1);
    modifiedHex = `#${characters.repeat(6 / characters.length)}`;
  }
  if (hex.length > 4 && hex.length < 7) {
    modifiedHex = `#${hex[1].repeat(6)}`;
  }
  return modifiedHex;
}

function hexReducer(acc: Array<string>, curr: string) {
  const processedHex = processHexString(curr);
  if (processedHex.length === 7) acc.push(processedHex);
  return acc;
}

function processText(text: string) {
  const backgroundColours = text.split(/[ \r\n,]+/).reduce(hexReducer, []);
  return backgroundColours;
}

function createColourBlockArrays(
  coloursArray: Array<string>,
  clicked: boolean,
  setClicked: Dispatch<SetStateAction<boolean>>,
) {
  return coloursArray.map((backgroundColour, _, array) => {
    const keyA = `${backgroundColour}`;
    const rowArray = array.map((textColour) => {
      const keyB = `${textColour}`;
      const textColourMod = textColour !== backgroundColour ? textColour : autoTextColourFromHex(backgroundColour);
      return (
        <ColourBlock
          key={`${keyA}-${keyB}`}
          backgroundColour={backgroundColour}
          textColour={textColourMod}
          clicked={clicked}
          setClicked={setClicked}
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

function getColourBlocks(text: string, clicked: boolean, setClicked: Dispatch<SetStateAction<boolean>>) {
  if (text === '') return null;
  const textArray = processText(text);
  if (textArray.length === 1)
    return (
      <ColourBlock
        backgroundColour={textArray[0]}
        textColour={autoTextColourFromHex(textArray[0])}
        clicked={clicked}
        setClicked={setClicked}
      />
    );
  return createColourBlockArrays(textArray, clicked, setClicked);
}
export default function ColourBlocks({ text = '' }) {
  const [clicked, setClicked] = useState(false);
  const colourBlocks = getColourBlocks(text, clicked, setClicked);
  return <div>{colourBlocks}</div>;
}
