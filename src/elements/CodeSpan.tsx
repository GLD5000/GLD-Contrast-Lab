import { ReactElement } from 'react';

export default function CodeSpan({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return (
    <code className="span mx-1 h-fit overflow-x-auto whitespace-pre rounded bg-black  p-1 font-mono text-green-400 placeholder:text-green-400">
      {content}
    </code>
  );
}
