import { ReactElement } from 'react';

export default function Bold({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <b>{content}</b>;
}
