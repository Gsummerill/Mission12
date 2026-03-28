import BookstorePage from './components/BookstorePage';

function App() {
  return (
    <>
      <header className="bg-dark text-white py-4 shadow-sm">
        <div className="container">
          <h1 className="mb-1">Hilton Mission 12 Online Bookstore</h1>
          <p className="mb-0 text-white-50">
            Category filtering, a session shopping cart, Bootstrap grid layout, and pagination
          </p>
        </div>
      </header>

      <main className="py-4">
        <BookstorePage />
      </main>
    </>
  );
}

export default App;
