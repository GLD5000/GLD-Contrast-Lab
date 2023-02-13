import { ReactElement } from 'react';

export default function Italic({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <em>{content}</em>;
}
