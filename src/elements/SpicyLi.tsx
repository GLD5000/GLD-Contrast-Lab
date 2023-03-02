import { MouseEvent, ReactElement } from 'react';
import SvgButton from './SvgButton';

export default function SpicyLi({
  content,
  style,
  className = 'm-2',
  id,
  clickFunction,
}: {
  className: string;
  style: { [elemName: string]: string };
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
  id: string;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <li id={id} className={className} style={style}>
      {content}
      <SvgButton
        text={undefined}
        clickFunction={clickFunction}
        id={`close-btn-${id}`}
        name={`close-btn-${id}`}
        className=""
        type="delete"
        showText={false}
        reverse={false}
        buttonClasses=" m-1  h-min items-center rounded-inherit hover:transition aspect-square hover:bg-neutral-400 hover:text-white text-current"
        svgClasses="stroke-current fill-none stroke-2 "
      />
    </li>
  );
}
