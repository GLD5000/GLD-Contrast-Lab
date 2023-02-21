import { ReactElement } from 'react';

export default function BlockQuote({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return (
    <blockquote className="mx-4 my-2 whitespace-pre-wrap rounded border-l-8 border-x-neutral-600 bg-neutral-400 p-2 text-textLight">
      {content}
    </blockquote>
  );
}
