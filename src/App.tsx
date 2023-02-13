import './App.css';
import Header from './sections/Header';
import Body from './sections/Body';
import Footer from './sections/Footer';

function App() {
  return (
    <section
      id="page-container"
      className="flex h-screen flex-col overflow-y-auto overflow-x-hidden border-zinc-600 bg-neutral-900 text-zinc-100"
    >
      <Header title="DevTemplate" />
      <Body />
      <Footer />
    </section>
  );
}

export default App;
