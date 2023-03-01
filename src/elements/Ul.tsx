import { ReactElement } from 'react';

export default function Ul({
  content,
  className = 'list-[square] pl-4',
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
  className: string;
}): ReactElement {
  return <ul className={className}>{content}</ul>;
}
