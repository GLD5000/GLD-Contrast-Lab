import { ReactElement } from 'react';

export default function H4({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <h4 className="p-2">{content}</h4>;
}
