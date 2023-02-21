import { FormEvent } from 'react';

export default function TextArea({
  id = 'textArea',
  placeholder = 'Copy or write text in here...',
  name = 'textArea',
  className = ' text-current, bg-inherit, border-inherit border rounded w-full h-full overflow-auto resize-none',
  value,
  onInput,
}: {
  id: string;
  placeholder: string;
  name: string;
  className: string;
  value: string;
  onInput: (e: FormEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      name={name}
      className={className}
      //   rows={7}
      // cols='70'
      onInput={onInput}
      value={value}
      wrap="hard"
    />
  );
}
