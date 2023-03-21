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
      <section className="flex h-screen flex-col overflow-x-hidden overflow-y-scroll border-bg-outline-lt bg-bg-var-lt text-bg-txt-lt dark:border-bg-outline-dk dark:bg-bg-var-dk dark:text-bg-txt-dk ">
        <Header toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} />
        <Body />
        <Footer />
      </section>
    </section>
  );
}

export default App;
