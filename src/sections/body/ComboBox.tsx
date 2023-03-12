import { FormEvent } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

import TextArea from '../../elements/TextArea';
import { colourSpace } from '../../utilities/colour/colourSpace';
import { contrast } from '../../utilities/colour/contrastRatio';
import { luminance } from '../../utilities/colour/luminance';
import ColourPicker from './ColourPicker';

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
    <>
      <section className="m-0 flex flex-col gap-4">
        <div className="mr-auto grid place-items-start">
          <label htmlFor="colour-input m-0 p-0">
            <h2 className="m-0 p-0 text-2xl font-bold">Add Colours</h2>
          </label>
          <p className="mt-2 mb-8 text-lg">Paste, Pick and Adjust</p>
          <p className="m-0">Use the colour picker and slider to choose and adjust colours.</p>
          <p className="m-0">Batch add colours by pasting them into the text box.</p>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-2">
          <ColourPicker />
          <div className="flex min-h-[9rem] w-80 flex-col rounded border bg-inherit">
            <TextArea
              id="colour-input"
              placeholder="Enter colours here e.g.:    #fafafa   rgb(120, 120, 120)   hsl(200, 50%, 50%)  (submit with space or enter )"
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
      </section>
      {colourSet.size > 0 && <hr className="my-8" />}
    </>
  );
}
