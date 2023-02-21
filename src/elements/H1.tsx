import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';

export default function H1({
  content,
}: {
  content: ReactElement | string | number | number | undefined | Array<ReactElement | string | number | undefined>;
}) {
  return <h1 className="p-2">{content}</h1>;
}

function helloWorld() {
  return 'hello';
}
// after code to be tested...

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;
  describe('#helloWorld', () => {
    it('returns "hello" from empty call', () => {
      expect(helloWorld()).toBe('hello');
    });
  });

  describe('H1', () => {
    it('renders text', () => {
      render(<H1 content="hello" />);
      // screen.debug();
      expect(screen.getByText(/hello/i)).toBeInTheDocument();
    });
  });
}
