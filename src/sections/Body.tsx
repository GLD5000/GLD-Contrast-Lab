import TextArea from '../elements/TextArea';

export default function Body() {
  return (
    <main id="body-container" className=" grid w-screen flex-grow justify-items-center gap-8 pt-2 align-middle ">
      <TextArea
        id="code-input"
        placeholder="Copy or write text in here..."
        name="codeInput"
        className=" h-full w-body min-w-body max-w-body resize-none overflow-auto rounded border border-inherit bg-neutral-800 text-neutral-300 placeholder:text-gray-300"
        value=""
        onInput={() => {
          throw new Error('Function not implemented.');
        }}
      />
    </main>
  );
}
