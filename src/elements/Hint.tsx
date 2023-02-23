import { ReactElement } from 'react';
import markdownParserFull from '../utilities/markdown/markdownParser';
import { getFlagMap, wrapText } from '../utilities/markdown/ParserLookupsBasic';

const flagMap = getFlagMap();

export default function Hint({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  if (typeof content !== 'string') return null;
  let hintContent = markdownParserFull({ text: content, indexIn: 0, flagMap, wrapText });
  if (typeof hintContent === 'string') {
    hintContent = hintContent.replaceAll(/(PpPpSSS)|(PpPpEEE)/g, '');
  }
  return (
    <div className="mx-4 my-2 whitespace-pre-wrap rounded border-l-8 border-x-yellow-300 bg-yellow-50 p-2 text-black">
      {hintContent}
    </div>
  );
}
