function SectionTitle({ title = null }: { title: null | string }) {
  return (
    <h3 className=" w-full p-2 text-center text-2xl underline decoration-neutral-300 decoration-solid decoration-1">
      {title}
    </h3>
  );
}

export default SectionTitle;
