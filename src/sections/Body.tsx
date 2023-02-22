import { FormEvent, useState } from 'react';
import TextArea from '../elements/TextArea';
import ColourBlocks from './body/ColourBlocks';

function processHexString(hex: string) {
  if (hex[0] !== '#' || hex.length < 2 || hex.slice(1).search(/#|[^0-9a-fA-F]/) > -1) return '';
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

function processText(text: string, limit: number) {
  const backgroundColours: Array<string> = [
    ...new Set(
      text
        .split(/[ \r\n,]+/)
        .reduce(hexReducer, [])
        .sort(),
    ),
  ];
  if (backgroundColours.length > limit) return backgroundColours.slice(0, limit);
  return backgroundColours;
}
export default function Body() {
  const [text, setText] = useState(`#fafafa
  #f4f4f5
  #e4e4e7
  #d4d4d8
  #a1a1aa
  #71717a
  #52525b
  #3f3f46
  #27272a
  #18181b`);
  const limit = 12;
  const textArray: Array<string> = processText(text, limit);
  return (
    <main id="body-container" className=" grid  flex-grow  justify-items-center  pt-2  align-middle">
      <section className="flex h-fit w-body min-w-body max-w-body flex-row flex-wrap justify-center gap-8 p-8 ">
        <TextArea
          id="code-input"
          placeholder="Copy or write text in here..."
          name="codeInput"
          className=" shrink-0 resize-y overflow-auto rounded border border-inherit bg-inherit text-inherit placeholder:text-gray-300"
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
