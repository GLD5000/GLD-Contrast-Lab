import { ReactElement } from 'react';

const styles: { [key: string]: { [key: string]: string } } = {
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
  const style: { [key: string]: string } = styles[type];

  return (
    <li className="m-2" style={style}>
      {content}
    </li>
  );
}
