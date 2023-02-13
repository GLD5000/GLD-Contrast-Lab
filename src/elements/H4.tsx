import { ReactElement } from 'react';

export default function H4({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <h4 className="p-2">{content}</h4>;
}
