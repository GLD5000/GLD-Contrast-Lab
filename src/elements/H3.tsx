import { ReactElement } from 'react';

export default function H3({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <h3 className="p-2">{content}</h3>;
}
