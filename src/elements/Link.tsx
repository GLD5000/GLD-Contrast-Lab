export default function Link({
  content,
  link,
  className = ' inline text-blue-700',
}: {
  className: string | undefined;
  content: string | undefined;
  link: string | undefined;
}) {
  return (
    <a className={className} href={link} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}
