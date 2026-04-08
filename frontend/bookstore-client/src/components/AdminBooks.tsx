import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';

const API_URL = 'https://bookstore-api-george.azurewebsites.net/api/books';

const emptyBook: Omit<Book, 'bookId'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, 'bookId'>>(emptyBook);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize));

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageNum: pageNum.toString(),
        sortOrder: 'asc',
      });
      const res = await fetch(`${API_URL}?${params}`);
      if (!res.ok) throw new Error('Failed to load books.');
      const data = await res.json();
      setBooks(data.books);
      setTotalBooks(data.totalBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pageNum]);

  const openAdd = () => {
    setEditingBook(null);
    setFormData(emptyBook);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    const { bookId, ...rest } = book;
    setFormData(rest);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      if (editingBook) {
        const res = await fetch(`${API_URL}/${editingBook.bookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, bookId: editingBook.bookId }),
        });
        if (!res.ok) throw new Error('Failed to update book.');
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, bookId: 0 }),
        });
        if (!res.ok) throw new Error('Failed to add book.');
      }

      closeForm();
      await fetchBooks();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book: Book) => {
    if (!confirm(`Delete "${book.title}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/${book.bookId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book.');
      await fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="card bookstore-card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Admin — Manage Books</h2>
            <p className="text-muted mb-0">Add, edit, or delete books in the database.</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Book
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mb-4 border-primary">
            <div className="card-header bg-primary text-white">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </div>
            <div className="card-body">
              {formError && <div className="alert alert-danger">{formError}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {(
                    [
                      { label: 'Title', name: 'title', type: 'text' },
                      { label: 'Author', name: 'author', type: 'text' },
                      { label: 'Publisher', name: 'publisher', type: 'text' },
                      { label: 'ISBN', name: 'isbn', type: 'text' },
                      { label: 'Classification', name: 'classification', type: 'text' },
                      { label: 'Category', name: 'category', type: 'text' },
                      { label: 'Page Count', name: 'pageCount', type: 'number' },
                      { label: 'Price ($)', name: 'price', type: 'number' },
                    ] as const
                  ).map(({ label, name, type }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        className="form-control"
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        step={name === 'price' ? '0.01' : undefined}
                        min={type === 'number' ? '0' : undefined}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-success" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={closeForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && <div className="alert alert-info">Loading books...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.bookId}>
                      <td>
                        <div className="fw-semibold">{book.title}</div>
                        <div className="text-muted small">ISBN: {book.isbn}</div>
                      </td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>
                        <span className="badge text-bg-success price-pill">
                          ${book.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => openEdit(book)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(book)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Page {pageNum} of {totalPages} ({totalBooks} books total)
              </div>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum((p) => p - 1)}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPageNum(page)}>
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum((p) => p + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminBooks;
