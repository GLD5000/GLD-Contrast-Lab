import { ReactElement } from 'react';

export default function Ol({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <ol className="pl-4">{content}</ol>;
}
