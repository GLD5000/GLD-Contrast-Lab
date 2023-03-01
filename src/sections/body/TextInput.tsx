import { Dispatch, FormEvent, SetStateAction } from 'react';
import Span from '../../elements/Span';
import TextArea from '../../elements/TextArea';

export default function TextInput({ text, setText }: { text: string; setText: Dispatch<SetStateAction<string>> }) {
  return (
    <div className="flex h-full w-full basis-5  flex-col">
      <label className="self-center text-2xl" htmlFor="code-input">
        Colours <Span className="text-neutral-500" content="(separate with spaces or linebreaks)" />
      </label>
      <TextArea
        id="code-input"
        placeholder="Copy or write text in here..."
        name="codeInput"
        className=" h-96 shrink-0 grow resize-y overflow-auto rounded bg-inherit text-inherit placeholder:text-gray-300"
        value={text}
        onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
          const { value: targetValue } = e.currentTarget;
          setText(targetValue);
        }}
      />
    </div>
  );
}
