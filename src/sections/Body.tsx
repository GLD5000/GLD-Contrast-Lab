import { FormEvent, useState } from 'react';
import TextArea from '../elements/TextArea';
import ColourBlocks from './body/ColourBlocks';

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
  const backgroundColours: Array<string> = text.split(/[ \r\n,]+/).reduce(hexReducer, []);
  return backgroundColours;
}
export default function Body() {
  const [text, setText] = useState('#0  #6  #f');
  const textArray: Array<string> = processText(text);
  return (
    <main id="body-container" className=" grid  flex-grow  justify-items-center  pt-2  align-middle">
      <section className="grid h-fit w-body min-w-body max-w-body grid-cols-2 justify-items-center gap-8 align-middle">
        <TextArea
          id="code-input"
          placeholder="Copy or write text in here..."
          name="codeInput"
          className=" h-full w-full resize-none overflow-auto rounded border border-inherit bg-neutral-800 text-neutral-300 placeholder:text-gray-300"
          value={text}
          onInput={(e: FormEvent<HTMLTextAreaElement>): void => {
            const { value: targetValue } = e.currentTarget;
            setText(targetValue);
          }}
        />

        <ColourBlocks textArray={textArray} />
      </section>
    </main>
  );
}
