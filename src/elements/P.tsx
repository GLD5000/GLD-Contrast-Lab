import { ReactElement } from 'react';

export default function P({
  className,
  content,
}: {
  className: string | undefined;
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <p className={className}>{content}</p>;
}
