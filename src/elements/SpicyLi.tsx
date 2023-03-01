import { ReactElement } from 'react';

export default function SpicyLi({
  content,
  style,
  className = 'm-2',
  id,
}: {
  className: string;
  style: { [elemName: string]: string };
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
  id: string;
}) {
  return (
    <li id={id} className={className} style={style}>
      {content}
    </li>
  );
}
