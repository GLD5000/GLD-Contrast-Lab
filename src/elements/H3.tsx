import { ReactElement } from 'react';

export default function H3({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <h3 className="p-2">{content}</h3>;
}
