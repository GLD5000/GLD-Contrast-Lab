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

  const list = getList();
  return (
    <div className="w-full self-center p-8 text-xl">
      <label htmlFor="code-input">
        Colours <Span className="text-neutral-500" content="(separate with spaces or linebreaks)" />
      </label>
      <div className="flex w-full flex-row flex-wrap gap-2 bg-white dark:bg-neutral-900">
        {list}
        <TextArea
          id="code-input"
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
