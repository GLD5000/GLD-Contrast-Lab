import { ReactElement } from 'react';

export default function H5({
  content,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
}) {
  return <h5 className="p-2">{content}</h5>;
}
