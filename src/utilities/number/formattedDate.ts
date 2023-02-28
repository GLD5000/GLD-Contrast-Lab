export default function formattedDate() {
  const dateRaw = new Date();
  const date = `${dateRaw.getDate().toString().padStart(2, '0')}/${(dateRaw.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${dateRaw.getFullYear()} ${dateRaw.getHours().toString().padStart(2, '0')}:${dateRaw
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return date;
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe('#formattedDate', () => {
    it('Date has correct format', () => {
      expect(formattedDate()).toMatch(/^\d\d\/\d\d\/\d\d\d\d[ ]\d\d:\d\d$/);
    });
  });
}
