import { ReactElement } from 'react';

export default function Span({
  content,
  type,
}: {
  type: string;
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  const string = type === 'double' ? `"${content}"` : content;
  return <span className="mx-1 bg-slate-200 p-1 text-neutral-900">{string}</span>;
}
