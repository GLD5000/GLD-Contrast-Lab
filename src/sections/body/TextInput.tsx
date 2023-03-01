import { Dispatch, SetStateAction } from 'react';
import ComboBox from './ComboBox';

export default function TextInput({
  text,
  setText,
  textArray,
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  textArray: string[];
}) {
  return (
    <div className="flex h-full w-full basis-5  flex-col">
      <ComboBox text={text} setText={setText} textArray={textArray} />
    </div>
  );
}
