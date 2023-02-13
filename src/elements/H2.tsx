import { ReactElement } from 'react';

export default function H2({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <h2 className="p-2">{content}</h2>;
}
