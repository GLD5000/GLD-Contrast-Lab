import { ReactElement } from 'react';

const styles: { [elemName: string]: { [elemName: string]: string } } = {
  bullet: { listStyleType: 'disc' },
  number: { listStyleType: 'decimal' },
};

export default function Li({
  content,
  type = 'bullet',
}: {
  type: string;
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  const style: { [elemName: string]: string } = styles[type];

  return (
    <li className="m-2" style={style}>
      {content}
    </li>
  );
}
