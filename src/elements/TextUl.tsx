function getListItems(arrayIn: string[]) {
  return arrayIn.map((content, index) => {
    const key = `list-item-${index}`;
    return (
      <li key={key} id="info-list-a" className="m-0 mb-1">
        {content}
      </li>
    );
  });
}
export default function TextUl({ textArray }: { textArray: string[] }) {
  const items = getListItems(textArray);
  return <ul className=" list-inside list-disc">{items} </ul>;
}
