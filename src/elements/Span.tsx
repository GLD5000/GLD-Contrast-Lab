import { ReactElement } from 'react';

export default function Span({
  content,
  className,
}: {
  className: string | undefined;
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <span className={className}>{content}</span>;
}
