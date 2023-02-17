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
    <section id="theme-wrapper" className={`${colourTheme} `}>
      <section className="flex h-screen flex-col overflow-x-hidden overflow-y-scroll border-borderLight text-textLight dark:border-borderLight dark:bg-neutral-900 dark:text-textDark">
        <Header title="DevTemplate" toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} />
        <Body />
        <Footer />
      </section>
    </section>
  );
}

export default App;
