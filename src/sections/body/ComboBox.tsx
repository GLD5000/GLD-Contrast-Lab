import { Dispatch, SetStateAction, FormEvent } from 'react';
import Span from '../../elements/Span';
import TextArea from '../../elements/TextArea';
import InlineList from './InlineList';

function getList(colours: string[]) {
  return <InlineList listArray={colours} />;
}

export default function ComboBox({
  text,
  setText,
  textArray,
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  textArray: string[];
}) {
  const list = getList(textArray);
  return (
    <label className="self-center text-2xl" htmlFor="code-input">
      Colours <Span className="text-neutral-500" content="(separate with spaces or linebreaks)" />
      <div className="flex flex-row flex-wrap gap-2">
        {list}
        <TextArea
          id="code-input"
          placeholder="Copy or write text in here..."
          name="codeInput"
          className=" h-60 w-80 shrink-0 grow resize-y overflow-auto rounded bg-inherit text-inherit placeholder:text-gray-300"
          value={text}
          onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
            const { value: targetValue } = e.currentTarget;
            setText(targetValue);
          }}
        />
      </div>
    </label>
  );
}
