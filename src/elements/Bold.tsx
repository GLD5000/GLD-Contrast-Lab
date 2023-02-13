import { ReactElement } from 'react';

export default function Bold({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <b>{content}</b>;
}
