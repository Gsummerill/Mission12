import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import BookstorePage from './components/BookstorePage';
import AdminBooks from './components/AdminBooks';

function App() {
  return (
    <Router>
      <header className="bg-dark text-white py-4 shadow-sm">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="mb-1">Hilton Mission 13 Online Bookstore</h1>
            <p className="mb-0 text-white-50">
              Browse books or manage the catalog from the admin page.
            </p>
          </div>

          <nav className="d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm" to="/">
              Storefront
            </Link>
            <Link className="btn btn-warning btn-sm" to="/adminbooks">
              Admin Books
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-4">
        <Routes>
          <Route path="/" element={<BookstorePage />} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
