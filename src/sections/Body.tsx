import { FormEvent, useState } from 'react';
import TextArea from '../elements/TextArea';
import ColourBlocks from './body/ColourBlocks';

export default function Body() {
  const [text, setText] = useState('#1 #3 #4 #6 #8 #a #c #e');
  return (
    <main id="body-container" className=" grid w-screen flex-grow justify-items-center gap-8 pt-2 align-middle ">
      <TextArea
        id="code-input"
        placeholder="Copy or write text in here..."
        name="codeInput"
        className=" h-full w-body min-w-body max-w-body resize-none overflow-auto rounded border border-inherit bg-neutral-800 text-neutral-300 placeholder:text-gray-300"
        value={text}
        onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
          const { value: targetValue } = e.currentTarget;
          setText(targetValue);
        }}
      />

      <ColourBlocks text={text} />
    </main>
  );
}
