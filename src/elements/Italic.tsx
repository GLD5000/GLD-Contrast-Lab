import { ReactElement } from 'react';

export default function Italic({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <em>{content}</em>;
}
