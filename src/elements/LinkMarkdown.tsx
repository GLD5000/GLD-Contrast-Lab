import { ReactElement } from 'react';

function getTags(string: string, start: number, end: number | undefined = undefined) {
  if (string.indexOf(',') > -1) return string.slice(start, end).split(',').join('&tags=');
  return string.slice(start, end);
}
function getUrl() {
  const { href } = window.location;
  if (href.indexOf('?') > -1) return href.split('?')[0];
  return href;
}
function sliceLinkLocalUrl(item: string) {
  const indexOfOpenBracket = item.indexOf('(');
  const startSlice = indexOfOpenBracket + 1;
  const urlField = item.slice(startSlice).replace('&', '');

  let url = getUrl();
  const titleFlag = 'title=';
  const titleIndex = urlField.indexOf(titleFlag);
  const tagsFlag = 'tags=';
  const tagIndex = urlField.indexOf(tagsFlag);
  const gotTags = tagIndex !== -1;
  const gotTitle = titleIndex !== -1;
  if (gotTags || gotTitle) url += '?';

  if (gotTags) url += getTags(urlField, tagIndex, (titleIndex > tagIndex && titleIndex) || undefined);

  if (gotTags && gotTitle) url += '&';

  if (gotTitle) url += getTitle(urlField, titleIndex, tagIndex);

  const indexOfClosedSquareBracket = item.indexOf(']');
  const text = item.slice(0, indexOfClosedSquareBracket);
  return (
    <a className=" inline text-blue-700" href={url}>
      {text}
    </a>
  );
}
function getTitle(urlField: string, titleIndex: number, tagIndex: number) {
  return urlField.slice(titleIndex, (tagIndex > titleIndex && tagIndex) || undefined);
}
function sliceLinkSimple(item: string) {
  const indexOfOpenBracket = item.indexOf('(');
  const startSlice = indexOfOpenBracket + 1;
  const url = item.slice(startSlice);

  const indexOfClosedSquareBracket = item.indexOf(']');
  const text = item.slice(0, indexOfClosedSquareBracket);
  return (
    <a className=" inline text-blue-700" href={url} target="_blank" rel="noreferrer">
      {text}
    </a>
  );
}

function itemHandler(item: string) {
  if (typeof item !== 'string') return item;
  const itemContainsLink = item.includes('http') || item.includes('www');
  if (itemContainsLink === false) return sliceLinkLocalUrl(item);
  return sliceLinkSimple(item);
}

export default function LinkMarkdown({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}): ReactElement | null {
  if (typeof content !== 'string') return null;
  const returnObject = itemHandler(content);

  return returnObject;
}
