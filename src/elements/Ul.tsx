import { ReactElement } from 'react';

export default function Ul({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}): ReactElement {
  return <ul className=" list-[square] pl-4">{content}</ul>;
}
