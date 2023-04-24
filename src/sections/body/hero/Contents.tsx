const colourClasses =
  'text-lg text-txt-mid hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-mid-dk dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk';

export default function Contents() {
  const contentsArray = ['Add-Colours', 'Compare-Colours', 'Export-Data'];

  return (
    <>
      <p className=" mb-2 text-txt-low dark:text-txt-low-dk">On this page:</p>
      {contentsArray.map((x) => (
        <a className={`${colourClasses}`} id={`contents-${x}`} key={x} href={`#${x}`}>
          {x.split('-')[0]}
        </a>
      ))}
    </>
  );
}
