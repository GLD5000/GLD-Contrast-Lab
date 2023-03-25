import { MouseEvent, ReactElement } from 'react';

function getContent(reverse: boolean, showText: boolean, text: string, svg: ReactElement) {
  return reverse ? (
    <>
      {showText && text}
      {svg}
    </>
  ) : (
    <>
      {svg}
      {showText && text}
    </>
  );
}

export default function SvgButtonNew({
  text = 'Add',
  clickFunction,
  id,
  name,
  showText = true,
  reverse = false,
  buttonClasses = `grid-cols-frAutoFr w-full h-full 
  `,
  svg,
  className = `px-2 py-1
   hover:border-current
   grid     
      rounded border-2 border-solid whitespace-pre-wrap hover:transition
    `,
}: {
  text: string | undefined;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void | (() => void);
  id: string | undefined;
  name: string | undefined;
  className: string | undefined;
  showText: boolean;
  reverse: boolean;
  buttonClasses: string | undefined;
  svg: ReactElement;
}) {
  const content = getContent(reverse, showText, text, svg);

  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickFunction}
      className={`cursor-pointer items-center ${className.replaceAll(/[\s]+/g, ' ')} ${buttonClasses}`}
      aria-label={name}
    >
      {content}
    </button>
  );
}
