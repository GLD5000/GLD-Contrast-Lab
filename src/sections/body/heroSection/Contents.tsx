const colourClasses =
  ' text-txt-mid hover:text-txt-main hover:underline hover:decoration-current hover:underline-offset-2 hover:transition focus:text-txt-main focus:underline focus:decoration-current  focus:underline-offset-2 focus:transition dark:text-txt-mid-dk dark:hover:text-txt-main-dk dark:focus:text-txt-main-dk';

export default function Contents() {
  const contentsArray = ['Add-Colours', 'Compare-Colours', 'Export-Data'];

  return (
    <div id="contents" className="mx-auto my-10 grid 2xl:absolute 2xl:left-10 2xl:top-20">
      <h3>On This Page:</h3>
      {contentsArray.map((x) => (
        <a className={`${colourClasses}`} id={`contents-${x}`} key={x} href={`#${x}`}>
          {x}
        </a>
      ))}
    </div>
  );
}
