import { useState } from 'react';
import Header from './sections/Header';
import Body from './sections/Body';
import Footer from './sections/Footer';
import MainContentLink from './sections/header/MainContentLink';

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
    <div id="theme-wrapper" className={colourTheme ? 'dark' : undefined}>
      <section className="flex h-screen flex-col overflow-x-hidden overflow-y-scroll border-border bg-bg text-txt-main dark:border-border-dk dark:bg-bg-dk dark:text-txt-main-dk ">
        <MainContentLink />
        <Header toggleColourTheme={toggleColourTheme} colourTheme={colourTheme} />
        <Body />
        <Footer />
      </section>
    </div>
  );
}

export default App;
