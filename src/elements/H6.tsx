import { ReactElement } from 'react';

export default function H6({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <h6 className="p-2">{content}</h6>;
}
