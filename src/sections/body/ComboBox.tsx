import { FormEvent } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

import Span from '../../elements/Span';
import TextArea from '../../elements/TextArea';
import InlineList from './InlineList';

function getList() {
  return <InlineList />;
}

export default function ComboBox() {
  const { textInput, dispatchColourInput } = useColourInputContext();
  function handleClickClearTags() {
    dispatchColourInput({ type: 'CLEAR_TAGS', payload: {} });
  }

  const list = getList();
  return (
    <div className="grid w-full items-center gap-4 self-center p-8 text-xl">
      <div className="flex flex-row flex-wrap items-center p-2">
        <label htmlFor="colour-input">
          Colours <Span className="text-neutral-500" content="(separate with spaces or linebreaks)" />
        </label>
        <button
          type="button"
          onClick={handleClickClearTags}
          className="m-2 rounded border border-current bg-pink-300 px-2 text-black"
        >
          Clear All
        </button>
      </div>
      <div className="m-2 flex flex-row flex-wrap gap-2 bg-white p-2 dark:bg-neutral-900">
        {list}
        <TextArea
          id="colour-input"
          placeholder="Copy or write text in here..."
          name="codeInput"
          className="shrink-0 grow resize-y overflow-auto rounded bg-inherit text-inherit placeholder:text-gray-500 dark:placeholder:text-gray-300"
          value={textInput}
          onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
            const { value: targetValue } = e.currentTarget;
            console.log(targetValue);
            dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: targetValue } });
          }}
        />
      </div>
    </div>
  );
}
