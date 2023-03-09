import { ReactElement } from 'react';

import LinkMarkdown from '../../elements/LinkMarkdown';
import Bold from '../../elements/Bold';
import Italic from '../../elements/Italic';
import BlockQuote from '../../elements/BlockQuote';
import H1 from '../../elements/H1';
import H2 from '../../elements/H2';
import H3 from '../../elements/H3';
import H4 from '../../elements/H4';
import H5 from '../../elements/H5';
import H6 from '../../elements/H6';
import Li from '../../elements/Li';
import P from '../../elements/P';
import CodeBox from '../../elements/CodeBox';
import Table from '../../elements/Table';
import Hint from '../../elements/Hint';
import InlineQuote from '../../elements/InlineQuote';
import CodeSpan from '../../elements/CodeSpan';

const lineEndRegex = /PpPpEEE(\r\n)?/;

const blockFlagStart = 'PpPpSSS[ ]{0,3}';
const blockFlagEndOptional = '(PpPpEEE)?[\r\n]*';
const blockFlagEnd = 'PpPpEEE\r\n';

const codeFlag = '[`~]{3,}';
const codeBlockOpen = new RegExp(blockFlagStart + codeFlag);
const codeBlockClosed = new RegExp(blockFlagEnd + blockFlagStart + codeFlag + blockFlagEndOptional);
const tableFlag = '[\\|]{3,}';
const tableBlockOpen = new RegExp(blockFlagStart + tableFlag + blockFlagEnd);
const tableBlockClosed = new RegExp(blockFlagEnd + blockFlagStart + tableFlag + blockFlagEndOptional);

const hintFlag = '\\?{3,}';
const hintBlockOpen = new RegExp(blockFlagStart + hintFlag + blockFlagEnd);
const hintBlockClosed = new RegExp(blockFlagStart + hintFlag + blockFlagEndOptional);

const flagArray: Array<[RegExp | string, { closingFlag: RegExp | string; type: string }]> = [
  [hintBlockOpen, { closingFlag: hintBlockClosed, type: 'hint' }],
  [tableBlockOpen, { closingFlag: tableBlockClosed, type: 'table' }],
  [codeBlockOpen, { closingFlag: codeBlockClosed, type: 'code' }],
  [/(PpPpSSS)\s?######/, { closingFlag: lineEndRegex, type: 'h6' }],
  [/(PpPpSSS)\s?#####(?!#)/, { closingFlag: lineEndRegex, type: 'h5' }],
  [/(PpPpSSS)\s?####(?!#)/, { closingFlag: lineEndRegex, type: 'h4' }],
  [/(PpPpSSS)\s?###(?!#)/, { closingFlag: lineEndRegex, type: 'h3' }],
  [/(PpPpSSS)\s?##(?!#)/, { closingFlag: lineEndRegex, type: 'h2' }],
  [/(PpPpSSS)\s?#(?!#)/, { closingFlag: lineEndRegex, type: 'h1' }],
  [/(PpPpSSS)[ ]{0,3}> ?/, { closingFlag: lineEndRegex, type: 'quote' }],
  [/(PpPpSSS)\s?-\s+/, { closingFlag: lineEndRegex, type: 'liUl' }],
  [/(PpPpSSS)\s?[0-9n]+\.\s+/, { closingFlag: lineEndRegex, type: 'liOl' }],
  [/(PpPpSSS)(?!#)/, { closingFlag: /PpPpEEE(\s*\n*\r\s*)*/, type: 'paragraph' }],
  [/\[(?=[^\]]+\]\([^)]+\))/, { closingFlag: ')', type: 'link' }],
  [/`/, { closingFlag: /`/, type: 'codeSpan' }],
  [/'(?=.+')/, { closingFlag: /'/, type: 'singleQuote' }],
  [/"(?=.+")/, { closingFlag: /"/, type: 'doubleQuote' }],
  ['**', { closingFlag: '**', type: 'bold' }],
  ['_', { closingFlag: '_', type: 'italic' }],
];

export const flagMap = new Map(flagArray);

export function getFlagMap(include: Array<string> | undefined = undefined) {
  if (include === undefined) return flagMap;
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
    paragraph: <P className={undefined} key={`pa${newKey}`} content={content} />,
    quote: <BlockQuote key={`qb${newKey}`} content={content} />,
    code: <CodeBox key={`cb${newKey}`} content={content} parse />,
    table: <Table key={`table${newKey}`} content={content} parse />,
    hint: <Hint key={`hint${newKey}`} content={content} />,
  };

  return typeHandler[type];
}
