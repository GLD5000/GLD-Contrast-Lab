import './App.css';
import { useState } from 'react';
import Header from './sections/Header';
import Body from './sections/Body';
import Footer from './sections/Footer';

function setThemeToLocalStorage(themeBoolean: boolean) {
  localStorage.setItem('theme', themeBoolean.toString());
}

function App() {
  const [colourTheme, setColourTheme] = useState(localStorage.getItem('theme') !== 'false');
  function toggleColourTheme() {
    setColourTheme((currentTheme: boolean) => !currentTheme);
    setThemeToLocalStorage(!colourTheme);
  }

  return (
    <section id="theme-wrapper" className={colourTheme ? 'dark' : undefined}>
      <section className="flex h-screen flex-col overflow-x-hidden overflow-y-scroll border-border bg-bg text-txt-main dark:border-border-dk dark:bg-bg-dk dark:text-txt-main-dk ">
        <Header toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} />
        <Body />
        <Footer />
      </section>
    </section>
  );
}

export default App;
