import { ReactElement } from 'react';

import Ol from '../../elements/Ol';
import Ul from '../../elements/Ul';

export function markParagraphs(string: string) {
  if (typeof string !== 'string') return string;
  const regex = /[\r\n]+/g;
  const returnString = `PpPpSSS${string.replaceAll(regex, 'PpPpEEE\r\nPpPpSSS')}PpPpEEE`;
  return returnString;
}
export function removeParagraphs(string: string) {
  const regex = /(PpPpEEE)|(PpPpSSS)/g;
  return string.replaceAll(regex, ``);
}

function findStringMatch(flag: string | RegExp, string: string, start = 0) {
  let startAt = start;
  const failedReturn = { length: 0, index: -1 };
  if (string === undefined) return failedReturn;
  if (flag === undefined) return { length: 0, index: string.length };
  if (startAt === -1) startAt = 0;

  const isString = typeof flag !== 'object';

  if (isString) {
    const index = string.indexOf(flag, startAt);
    const flagMissing = index === -1;
    if (flagMissing) return failedReturn;
    return { length: flag.length, index };
  }

  const matchReturnArray = string.match(flag);
  if (matchReturnArray === undefined) return failedReturn;
  const match = (matchReturnArray && matchReturnArray[0]) || '';
  const index = string.indexOf(match, startAt);
  return { length: match.length, index };
}
function sliceFlaggedText({
  string,
  firstFlagLength,
  firstFlagIndex,
  secondFlagLength,
  secondFlagIndex,
}: {
  string: string;
  firstFlagLength: number;
  firstFlagIndex: number;
  secondFlagLength: number;
  secondFlagIndex: number;
}) {
  const flaggedTextStart = firstFlagIndex + firstFlagLength;
  const afterFlaggedStart = secondFlagIndex + secondFlagLength;
  const beforeFlag = firstFlagIndex === 0 ? undefined : string.slice(0, firstFlagIndex);
  const flaggedText = string.slice(flaggedTextStart, secondFlagIndex);
  const afterFlag = string.length > afterFlaggedStart ? string.slice(afterFlaggedStart) : undefined;

  return { beforeFlag, flaggedText, afterFlag };
}

function stringHasFlag(
  string: string | undefined | undefined,
  flagMap: Map<RegExp | string, { closingFlag: RegExp | string; type: string }>,
) {
  if (typeof string !== 'string') return { type: undefined };
  const returnObject: {
    type: string | undefined;
    beforeFlag: string | undefined;
    flaggedText: string | undefined;
    afterFlag: string | undefined;
  } = { type: '', beforeFlag: '', flaggedText: '', afterFlag: '' };
  const isEmptyString = string === undefined || string === '';

  if (isEmptyString) return { type: undefined };

  const workingObject: {
    string: string;
    firstFlagIndex: number;
    firstFlagLength: number;
    secondFlagLength: number;
    secondFlagIndex: number;
    flagFromMap: string | RegExp;
  } = {
    string,
    firstFlagIndex: string.length,
    firstFlagLength: -1,
    secondFlagLength: -1,
    secondFlagIndex: -1,
    flagFromMap: '',
  };

  flagMap.forEach((value, key) => {
    const firstStringMatch = findStringMatch(key, string);
    const firstFlagMissing = firstStringMatch.index === -1;
    if (firstFlagMissing) return;
    const secondFlagForMatch = value.closingFlag;
    const secondStringMatch = findStringMatch(
      secondFlagForMatch,
      string,
      firstStringMatch.index + firstStringMatch.length,
    );
    const secondFlagFound = secondStringMatch.index > -1;
    const firstFlagIsEarliest = firstStringMatch.index < workingObject.firstFlagIndex;
    if (firstFlagIsEarliest && secondFlagFound) {
      workingObject.firstFlagLength = firstStringMatch.length;
      workingObject.firstFlagIndex = firstStringMatch.index;
      workingObject.secondFlagLength = secondStringMatch.length;
      workingObject.secondFlagIndex = secondStringMatch.index;
      workingObject.flagFromMap = key;
      returnObject.type = value.type;
      ({
        beforeFlag: returnObject.beforeFlag,
        flaggedText: returnObject.flaggedText,
        afterFlag: returnObject.afterFlag,
      } = sliceFlaggedText(workingObject));
    }
  });
  return returnObject;
}

function findObjectType(wrappedObject: ReactElement | Array<ReactElement>) {
  if (!wrappedObject) return 'nonList';
  let key: string | undefined = '';
  if (wrappedObject && Array.isArray(wrappedObject)) key = wrappedObject[0]?.key?.toString();
  if (wrappedObject && !Array.isArray(wrappedObject) && typeof wrappedObject === 'object')
    key = wrappedObject.key?.toString();
  const isOrdered = key && key[0] === 'O';
  const isUnordered = key && key[0] === 'U';
  if (key && (isOrdered || isUnordered)) return key[0];
  return 'nonList';
}

function wrapLists(
  arrayOfObjects: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>,
) {
  const returnArray: Array<ReactElement> = [];

  let listItemArray: Array<ReactElement> = [];
  let listType = '';
  if (!arrayOfObjects || Array.isArray(arrayOfObjects) === false) return arrayOfObjects;
  if (Array.isArray(arrayOfObjects))
    arrayOfObjects.forEach((paragraph, index, arr) => {
      if (typeof paragraph !== 'object') return;
      const wrappedObject = paragraph;
      const type = findObjectType(wrappedObject);
      const nonListItem = type === 'nonList';
      if (nonListItem) {
        const wasListItem = listType !== type && listType !== '';
        if (wasListItem) {
          const key = index;
          // list type just changed
          // make ol or ul object
          const wasOrderedList = listType === 'O';
          const list = wasOrderedList ? (
            <Ol key={`${key}-Ol`} content={listItemArray} />
          ) : (
            <Ul key={`${key}-Ul`} content={listItemArray} className="list-[square] pl-4" />
          );
          returnArray.push(list);
          listType = type;
          listItemArray = [];
        }
        returnArray.push(wrappedObject);
      }
      const isOrderedListItem = type === 'O';
      if (isOrderedListItem) {
        if (listType !== type && listItemArray.length > 0) {
          const key = index;

          returnArray.push(<Ul key={`Ol${key}`} content={listItemArray} className="list-[square] pl-4" />);
          listItemArray = [];
        }
        listType = type;
        listItemArray.push(wrappedObject);
      }
      const isUnorderedListItem = type === 'U';
      if (isUnorderedListItem) {
        if (listType !== type && listItemArray.length > 0) {
          const key = index;
          returnArray.push(<Ol key={`Ol${key}`} content={listItemArray} />);
          listItemArray = [];
        }

        listType = type;
        listItemArray.push(wrappedObject);
      }
      const isLastListItem = index === arr.length - 1;
      const listItemArrayHasItems = listItemArray.length > 0;
      if (isLastListItem && listItemArrayHasItems) {
        const key = index;
        const list =
          listType === 'O' ? (
            <Ol key={`Ol&${key}`} content={listItemArray} />
          ) : (
            <Ul key={`Ul&${key}`} content={listItemArray} className="list-[square] pl-4" />
          );
        returnArray.push(list);
        listItemArray = [];
      }
    });
  return returnArray;
}

export function recursiveParser({
  text = undefined,
  indexIn = 0,
  flagMap,
  wrapText,
}: {
  text: string | undefined;
  indexIn: number;
  flagMap: Map<RegExp | string, { closingFlag: RegExp | string; type: string }>;
  wrapText: (args: {
    index: number;
    content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
    type: string;
  }) => ReactElement;
}): Array<ReactElement | string | number | undefined> | ReactElement | string | number | undefined {
  let index = indexIn;
  const {
    type,
    beforeFlag,
    flaggedText,
    afterFlag,
  }: {
    type: string | undefined;
    beforeFlag?: string | undefined;
    flaggedText?: string | undefined;
    afterFlag?: string | undefined;
  } = stringHasFlag(text, flagMap);
  if (type === undefined) return text;
  const shouldParse = type !== 'codeSpan' && type !== 'code' && type !== 'table' && type !== 'link' && type !== 'span';
  const processedflaggedText = shouldParse
    ? recursiveParser({ text: flaggedText, indexIn: index, flagMap, wrapText })
    : flaggedText;
  index += 1;

  const wrappedFlaggedText = wrapText({ index, content: processedflaggedText, type });
  const returnArray: Array<ReactElement | string | number | undefined> = [];
  if (beforeFlag !== undefined) returnArray.push(beforeFlag);
  returnArray.push(wrappedFlaggedText);
  if (afterFlag !== undefined) {
    const parserReturn = recursiveParser({ text: afterFlag, indexIn: index, flagMap, wrapText });
    if (Array.isArray(parserReturn)) {
      returnArray.push(...parserReturn);
    } else {
      returnArray.push(parserReturn);
    }
  }
  return returnArray.length === 1 ? returnArray[0] : returnArray;
}

export default function markdownParserFull({
  text,
  indexIn = 0,
  flagMap,
  wrapText,
}: {
  text: string;
  indexIn: number;
  flagMap: Map<RegExp | string, { closingFlag: RegExp | string; type: string }>;
  wrapText: (args: {
    index: number;
    content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
    type: string;
  }) => ReactElement;
}) {
  if (text === undefined) return undefined;
  const string = markParagraphs(text);

  const arrayOfObjects = recursiveParser({
    text: string,
    indexIn,
    wrapText,
    flagMap,
  });
  const returnArray = wrapLists(arrayOfObjects);
  return returnArray;
}
