import { ReactElement } from 'react';

export default function H1({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <h1 className="p-2">{content}</h1>;
}
