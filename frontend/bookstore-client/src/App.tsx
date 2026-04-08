import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import BookstorePage from './components/BookstorePage';
import AdminBooks from './components/AdminBooks';

function NavBar() {
  const location = useLocation();
  return (
    <header className="bg-dark text-white py-4 shadow-sm">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
        <div>
          <h1 className="mb-1">Hilton Mission 13 Online Bookstore</h1>
          <p className="mb-0 text-white-50">
            Phase 6 — Add, edit, and delete books via an admin page
          </p>
        </div>
        <nav className="d-flex gap-3">
          <Link
            to="/"
            className={`btn btn-sm ${location.pathname === '/' ? 'btn-light' : 'btn-outline-light'}`}
          >
            Bookstore
          </Link>
          <Link
            to="/adminbooks"
            className={`btn btn-sm ${location.pathname === '/adminbooks' ? 'btn-light' : 'btn-outline-light'}`}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="py-4">
        <div className="container">
          <Routes>
            <Route path="/" element={<BookstorePage />} />
            <Route path="/adminbooks" element={<AdminBooks />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
