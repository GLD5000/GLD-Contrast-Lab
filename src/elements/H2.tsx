import { ReactElement } from 'react';

export default function H2({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <h2 className="p-2">{content}</h2>;
}
