import { ReactElement } from 'react';
import markdownParserFull from '../utilities/markdownParser';
import { getFlagMap, wrapText } from '../utilities/ParserLookupsBasic';

const flagMap = getFlagMap();

export default function Hint({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  if (typeof content !== 'string') return null;
  let hintContent = markdownParserFull({ text: content, indexIn: 0, flagMap, wrapText });
  if (typeof hintContent === 'string') {
    console.log(hintContent);
    hintContent = hintContent.replaceAll(/(PpPpSSS)|(PpPpEEE)/g, '');
  }
  return (
    <div className="mx-4 my-2 whitespace-pre-wrap rounded border-l-8 border-x-hintYellow bg-cornsilk p-2 text-black">
      {hintContent}
    </div>
  );
}
