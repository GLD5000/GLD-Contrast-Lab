import { ReactElement } from 'react';

export default function InlineQuote({
  content,
  type,
}: {
  type: string;
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  const string = type === 'double' ? `"${content}"` : content;
  return <span className="mx-1 bg-slate-200 p-1 text-neutral-900">{string}</span>;
}
