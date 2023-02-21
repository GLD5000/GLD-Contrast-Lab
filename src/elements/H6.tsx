import { ReactElement } from 'react';

export default function H6({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <h6 className="p-2">{content}</h6>;
}
