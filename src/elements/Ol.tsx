import { ReactElement } from 'react';

export default function Ol({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <ol className="pl-4">{content}</ol>;
}
