import { FormEvent } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

import Span from '../../elements/Span';
import TextArea from '../../elements/TextArea';
import ColourPicker from './ColourPicker';
import InlineList from './InlineList';

function getList() {
  return <InlineList />;
}

export default function ComboBox() {
  const { textInput, colourSet, dispatchColourInput } = useColourInputContext();

  const list = getList();
  return (
    <div className="mx-auto grid w-full max-w-[1200px] items-center self-center p-4">
      <div className="m-2 flex flex-col gap-2">
        <label htmlFor="colour-input">
          <b className="text-lg">Add Colours: </b>
        </label>
        <div className="flex flex-row flex-wrap justify-center gap-2">
          <ColourPicker />
          <TextArea
            id="colour-input"
            placeholder="Enter colours here (separated by spaces, tabs, or line-breaks) e.g.:      #fafafa  /  rgb(120,120,120)  /  hsl(200,50%,50%)"
            name="codeInput"
            className=" min-h-[9rem] w-80 resize-none overflow-auto rounded border bg-inherit p-2 text-base placeholder:text-gray-600 dark:placeholder:text-gray-300"
            value={textInput}
            onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
              const { value: targetValue } = e.currentTarget;
              dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: targetValue } });
            }}
          />
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-around p-2">
        <div className="mr-auto grid place-items-start">
          <div>
            <b className="text-lg">Current Colours: </b>
            <Span className="text-base text-neutral-800 dark:text-neutral-200" content={`(${colourSet.size})`} />
          </div>
        </div>
        <div className="p-2">{list}</div>
      </div>
    </div>
  );
}
