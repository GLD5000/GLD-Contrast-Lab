import { MouseEvent } from 'react';

export default function ImageButton({
  backgroundColor,
  text = 'Add',
  clickFunction,
  id,
  name,
  className = 'w-full h-full',
  activeClasses = 'active:bg-slate-400',
  conditionalClasses,
  imageUrl,
}: {
  backgroundColor: string;
  text: string;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  id: string;
  name: string;
  className: string;
  activeClasses: string;
  conditionalClasses: string;
  imageUrl: string;
}) {
  function clickHandler(e: MouseEvent<HTMLButtonElement>) {
    clickFunction(e);
  }

  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickHandler}
      className={`flex items-center gap-2 border-2 py-1 px-2 hover:transition active:bg-slate-300 ${activeClasses} ${className} ${
        backgroundColor && backgroundColor
      } ${conditionalClasses && conditionalClasses}`}
    >
      {!imageUrl && text}
      {imageUrl && (
        <>
          Log Out
          <img
            referrerPolicy="no-referrer"
            className="aspect-square h-8 rounded-full"
            alt="User Profile"
            src={imageUrl}
          />
        </>
      )}
    </button>
  );
}
