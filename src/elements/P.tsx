import { ReactElement } from 'react';

export default function P({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <p>{content}</p>;
}
