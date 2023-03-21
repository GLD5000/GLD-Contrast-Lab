import { useState, useEffect } from 'react';
import SvgButton from '../../elements/SvgButton';

export default function CsvButton({ data, messageIn }: { data: string; messageIn: string }) {
  const [copyButtonMessage, setCopyButtonMessage] = useState(messageIn);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopyButtonMessage(messageIn);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyButtonMessage, messageIn]);

  return (
    <SvgButton
      type={copyButtonMessage === messageIn ? 'duplicate' : 'tick'}
      key={`${1}copyCode`}
      text={copyButtonMessage}
      clickFunction={() => {
        navigator.clipboard.writeText(data);
        setCopyButtonMessage('Copied!');
      }}
      showText
      reverse={false}
      buttonClasses={undefined}
      className="flex h-9 justify-center gap-2 text-sm hover:bg-black hover:text-white hover:transition focus:text-white focus:transition hover:dark:bg-white hover:dark:text-black focus:dark:bg-white focus:dark:text-black"
      svgClasses="stroke-1 fill-none stroke-current"
      id="copy-table"
      name="Copy SVG Info"
      svgWrapperClasses="h-6 w-6"
    />
  );
}
