import { ReactElement } from 'react';

import LinkMarkdown from '../../elements/LinkMarkdown';
import Bold from '../../elements/Bold';
import Italic from '../../elements/Italic';
import H1 from '../../elements/H1';
import H2 from '../../elements/H2';
import H3 from '../../elements/H3';
import H4 from '../../elements/H4';
import H5 from '../../elements/H5';
import H6 from '../../elements/H6';
import Li from '../../elements/Li';
import InlineQuote from '../../elements/InlineQuote';
import CodeSpan from '../../elements/CodeSpan';

const lineEndRegex = /PpPpEEE(\r\n)?/;

const flagArray: Array<[RegExp | string, { closingFlag: RegExp | string; type: string }]> = [
  [/(PpPpSSS)\s?######/, { closingFlag: lineEndRegex, type: 'h6' }],
  [/(PpPpSSS)\s?#####(?!#)/, { closingFlag: lineEndRegex, type: 'h5' }],
  [/(PpPpSSS)\s?####(?!#)/, { closingFlag: lineEndRegex, type: 'h4' }],
  [/(PpPpSSS)\s?###(?!#)/, { closingFlag: lineEndRegex, type: 'h3' }],
  [/(PpPpSSS)\s?##(?!#)/, { closingFlag: lineEndRegex, type: 'h2' }],
  [/(PpPpSSS)\s?#(?!#)/, { closingFlag: lineEndRegex, type: 'h1' }],
  [/(PpPpSSS)\s?-\s+/, { closingFlag: lineEndRegex, type: 'liUl' }],
  [/(PpPpSSS)\s?[0-9n]+\.\s+/, { closingFlag: lineEndRegex, type: 'liOl' }],
  [/\[(?=[^\]]+\]\([^)]+\))/, { closingFlag: ')', type: 'link' }],
  [/`/, { closingFlag: /`/, type: 'codeSpan' }],
  [/'(?=.+')/, { closingFlag: /'/, type: 'singleQuote' }],
  [/"(?=.+")/, { closingFlag: /"/, type: 'doubleQuote' }],
  ['**', { closingFlag: '**', type: 'bold' }],
  ['_', { closingFlag: '_', type: 'italic' }],
];

export const flagMap: Map<RegExp | string, { closingFlag: RegExp | string; type: string }> = new Map(flagArray);

export function getFlagMap(include: Array<string> | undefined = undefined) {
  if (include === undefined || include?.length === 0) return flagMap;
  const returnMap = new Map();
  flagMap.forEach((value, key) => {
    if (include.includes(value.type)) returnMap.set(key, value);
  });
  return returnMap;
}

export function wrapText({
  index,
  content,
  type,
}: {
  index: number;
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
  type: string;
}) {
  const newKey = `x${index}`;
  const typeHandler: { [key: string]: ReactElement } = {
    link: <LinkMarkdown key={`l${newKey}`} content={content} />,
    singleQuote: <InlineQuote key={`span${newKey}`} content={content} type="single" />,
    doubleQuote: <InlineQuote key={`span${newKey}`} content={content} type="double" />,
    codeSpan: <CodeSpan key={`codeSpan${newKey}`} content={content} />,
    bold: <Bold key={`bo${newKey}`} content={content} />,
    italic: <Italic key={`it${newKey}`} content={content} />,
    h1: <H1 key={`h1${newKey}`} content={content} />,
    h2: <H2 key={`h2${newKey}`} content={content} />,
    h3: <H3 key={`h3${newKey}`} content={content} />,
    h4: <H4 key={`h4${newKey}`} content={content} />,
    h5: <H5 key={`h5${newKey}`} content={content} />,
    h6: <H6 key={`h6${newKey}`} content={content} />,
    liUl: <Li key={`Ul${newKey}`} content={content} type="bullet" />,
    liOl: <Li key={`Ol${newKey}`} content={content} type="number" />,
  };

  return typeHandler[type];
}
