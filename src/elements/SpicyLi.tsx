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
        svgWrapperClasses="pointer-events-none h-6 w-6"
        text={undefined}
        clickFunction={clickFunction}
        id={`${id}-close-btn`}
        name={`${id}-close-btn`}
        className=""
        type="delete"
        showText={false}
        reverse={false}
        buttonClasses="  h-6 rounded-full hover:transition aspect-square hover:bg-neutral-400 hover:text-white text-current items-center"
        svgClasses="stroke-current fill-none stroke-2 h-full w-full"
      />
    </li>
  );
}
