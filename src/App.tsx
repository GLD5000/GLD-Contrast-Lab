import './App.css';
import { useState } from 'react';
import Header from './sections/Header';
import Body from './sections/Body';
import Footer from './sections/Footer';

function App() {
  const [colourTheme, setColourTheme] = useState('dark');
  function toggleColourTheme() {
    setColourTheme((currentTheme: string) => {
      if (currentTheme === 'dark') {
        return '';
      }
      return 'dark';
    });
  }

  return (
    <section
      id="page-container"
      className={
        `${colourTheme} flex h-screen snap-mandatory snap-always flex-col overflow-y-auto` +
        ` overflow-x-hidden border-zinc-600 bg-neutral-900 text-zinc-100`
      }
    >
      <Header title="DevTemplate" toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} />
      <Body />
      <Footer />
    </section>
  );
}

export default App;
