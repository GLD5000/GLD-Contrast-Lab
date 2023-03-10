import { FormEvent } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

import TextArea from '../../elements/TextArea';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { contrast } from '../../utilities/colour/contrastRatio';
import { luminance } from '../../utilities/colour/luminance';
import ColourPicker from './ColourPicker';
import InlineList from './InlineList';

function getHexData(hexString: string) {
  const luminanceFloat = luminance.convertHexToLuminance(hexString);

  const HSL = colourSpace.convertHexToHslString(hexString);
  const RGB = colourSpace.convertHextoRgbString(hexString);
  const Luminance = luminance.convertHexToLuminancePercent(hexString);
  const Black = `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`;
  const White = `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`;

  return `HSL: ${HSL}
RGB: ${RGB}
Relative Luminance: ${Luminance}
Contrast w/ Black: ${Black}
Contrast w/ White: ${White}`;
  // return `  Relative Luminance: ${Luminance}
  // Contrast Black: ${Black}
  // Contrast White: ${White}`;
}

export default function ComboBox() {
  const { textInput, colourSet, recentColour, dispatchColourInput } = useColourInputContext();

  return (
    <div className="mx-auto grid w-full max-w-[1200px] items-center self-center p-4">
      <div className="m-2 flex flex-col gap-2">
        <label htmlFor="colour-input">
          <b className="text-lg">Add Colours: </b>
        </label>
        <div className="flex flex-row flex-wrap justify-center gap-2">
          <ColourPicker />
          <div className="flex min-h-[9rem] w-80 flex-col rounded border bg-inherit">
            <TextArea
              id="colour-input"
              placeholder="Enter colours here (separated by spaces, tabs, or line-breaks) e.g.:      #fafafa  /  rgb(120,120,120)  /  hsl(200,50%,50%)"
              name="codeInput"
              className="shrink grow resize-none overflow-auto bg-transparent px-2 pt-2 text-base placeholder:text-gray-600 dark:placeholder:text-gray-300"
              value={textInput}
              onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
                const { value: targetValue } = e.currentTarget;
                dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: targetValue } });
              }}
            />
            {recentColour.length > 0 && (
              <pre className="shrink-0 grow px-2 text-xs text-green-700 dark:text-green-300">
                {getHexData(recentColour)}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className="grid p-2">
        <div className="mr-auto grid place-items-start">
          <div>{colourSet.size > 0 && <b className="text-lg">Current Colours: </b>}</div>
        </div>
        <InlineList />
      </div>
    </div>
  );
}
