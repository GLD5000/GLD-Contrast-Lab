import { MouseEvent, ReactElement } from 'react';
import SvgButton from './SvgButton';

export default function SpicyLi({
  content,
  style,
  className = 'm-2',
  id,
  closeFunction,
  tagFunction,
}: {
  className: string;
  style: { [key: string]: string };
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
  id: string;
  closeFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  tagFunction: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <li id={id} className={className} style={style}>
      <button type="button" id={`${id}-tag-btn`} onClick={tagFunction} className="mx-auto p-1">
        {content}
      </button>
      <SvgButton
        svgWrapperClasses="pointer-events-none h-6 w-6"
        text={undefined}
        clickFunction={closeFunction}
        id={`${id}-close-btn`}
        name={`${id}-close-btn`}
        className=""
        type="delete"
        showText={false}
        reverse={false}
        buttonClasses="  h-6 rounded-full hover:transition aspect-square hover:bg-[#767676] hover:text-white text-current items-center"
        svgClasses="stroke-current fill-none stroke-2 h-full w-full"
      />
    </li>
  );
}
