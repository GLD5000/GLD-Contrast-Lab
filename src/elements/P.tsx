import { ReactElement } from 'react';

export default function P({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <p>{content}</p>;
}
