import { FormEvent, KeyboardEvent } from 'react';

function InputText({
  placeholder = 'Type here...',
  onInput,
  listId,
  value = '',
}: {
  placeholder: string;
  onInput: (e: string) => void;
  listId: string;
  value: string;
}) {
  const handler = (e: FormEvent<HTMLInputElement>): void => {
    const { value: targetValue } = e.currentTarget;
    onInput(targetValue);
  };
  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Enter') return;
    e.currentTarget.blur();
  };

  return (
    <input
      className="h-8 w-full rounded border border-zinc-600 bg-inherit p-1"
      type="text"
      onFocus={(e) => e.target.select()}
      onChange={handler}
      onKeyDown={handleEnter}
      placeholder={placeholder}
      list={listId}
      autoComplete="off"
      value={value}
    />
  );
}

export default InputText;
