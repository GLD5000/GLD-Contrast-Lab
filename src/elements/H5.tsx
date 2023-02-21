import { ReactElement } from 'react';

export default function H5({
  content,
}: {
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <h5 className="p-2">{content}</h5>;
}
