import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* BookProvider membungkus semua halaman supaya data buku bisa diakses lewat Context */}
      <BookProvider>
        <div className="App">
          <Navbar />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <footer className="app-footer">
            Praktikum Pengembangan Aplikasi Web - Pertemuan 3 - React Basics
          </footer>
        </div>
      </BookProvider>
    </BrowserRouter>
  );
}

export default App;
