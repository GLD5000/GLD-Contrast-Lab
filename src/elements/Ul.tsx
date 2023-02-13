import { ReactElement } from 'react';

export default function Ul({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}): ReactElement {
  return <ul className=" list-[square] pl-4">{content}</ul>;
}
